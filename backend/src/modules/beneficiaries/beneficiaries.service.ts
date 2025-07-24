import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertBeneficiarieDto } from './dto/insert-beneficiarie.dto';
import { UpdateBeneficiarieDto } from './dto/update-beneficiarie.dto';
import { DeleteBeneficiarieDto } from './dto/delete-beneficiarie.dto';

@Injectable()
export class BeneficiariesService {
    constructor(private databaseService: DatabaseService) { };

    //CRUD SENCILLO (CREATE - READ - UPDATE - DELETE)

    async insertBeneficiarie(dto: InsertBeneficiarieDto) {
        const { nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario } = dto;
        const query = `INSERT INTO public.beneficiarios(nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario, fecha_registro)
                    VALUES($1, $2, $3, $4, now())
                    RETURNING id_beneficiario, nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario, fecha_registro;`;
        const values = [nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario];
        try {
            const result = await this.databaseService.query(query, values);
            const beneficiario = result.rows[0];
            return {
                p_message: 'Beneficiario ingresado exitosamente',
                p_status: true,
                p_data: {
                    sub: beneficiario.id_beneficiario,
                    beneficiario: beneficiario.nombres_beneficiario,
                    cedula: beneficiario.cedula_beneficiario,
                    direccion: beneficiario.direccion_beneficiario,
                    telefono: beneficiario.telefono_beneficiario,
                    fecha: beneficiario.fecha_registro
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getBeneficiaries(res) {
        const query = `SELECT id_beneficiario, nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario, fecha_registro 
                    FROM public.beneficiarios;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    beneficiarios: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            });
        }
    }

    async getBeneficiarieByCedula(req, res) {
        const { cedula_beneficiario } = req.body;
        const query = `SELECT id_beneficiario, nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario, fecha_registro
                    FROM public.beneficiarios
                    WHERE cedula_beneficiario = $1;`;
        const values = [cedula_beneficiario];
        try {
            const result = await this.databaseService.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    p_message: 'Beneficiario no encontrado',
                    p_status: false,
                    p_data: { beneficiario: [] }
                });
            }
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    beneficiario: result.rows
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            });
        }
    }

    async updateBeneficiarie(dto: UpdateBeneficiarieDto) {
        const { nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario, id_beneficiario } = dto;
        const query = `UPDATE public.beneficiarios
                    SET nombres_beneficiario = $1, cedula_beneficiario = $2, direccion_beneficiario = $3, telefono_beneficiario = $4
                    WHERE id_beneficiario = $5
                    RETURNING nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario`;
        const values = [nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario, id_beneficiario];
        try {
            const result = await this.databaseService.query(query, values);
            const beneficiario = result.rows[0];
            return {
                p_message: 'Beneficiario ingresado exitosamente',
                p_status: true,
                p_data: {
                    beneficiario: beneficiario.nombres_beneficiario,
                    cedula: beneficiario.cedula_beneficiario,
                    direccion: beneficiario.direccion_beneficiario,
                    telefono: beneficiario.telefono_beneficiario
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteBeneficiarie(dto: DeleteBeneficiarieDto) {
        const { id_beneficiario } = dto;
        const query = `DELETE FROM public.beneficiarios WHERE id_beneficiario = $1;`;
        const values = [id_beneficiario];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_message: 'Beneficiario eliminado correctamente',
                p_status: true,
                p_data: {}
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    //CONSULTAS COMPLEJAS
    async getAllBeneficiariesWithDeliveries(res) {
        const query = `SELECT 
                    b.id_beneficiario,
                    b.nombres_beneficiario,
                    b.cedula_beneficiario,
                    b.direccion_beneficiario,
                    b.telefono_beneficiario,
                    e.id_entrega,
                    e.beneficiario_id,
                    e.donacion_id,
                    e.fecha_entrega,
                    dn.detalle_donacion
                FROM public.beneficiarios b
                INNER JOIN public.entregas e ON b.id_beneficiario = e.beneficiario_id
                INNER JOIN public.donaciones dn ON e.donacion_id = dn.id_donacion
                ORDER BY e.fecha_entrega ASC;`;
        try {
            const result = await this.databaseService.query(query, []);

            const beneficiariesWithDeliveries = result.rows.map(row => ({
                id_beneficiario: row.id_beneficiario,
                nombres_beneficiario: row.nombres_beneficiario,
                cedula_beneficiario: row.cedula_beneficiario,
                direccion_beneficiario: row.direccion_beneficiario,
                telefono_beneficiario: row.telefono_beneficiario,
                detalle_donacion: row.detalle_donacion,
                entrega: {
                    id_entrega: row.id_entrega,
                    beneficiario_id: row.beneficiario_id,
                    donacion_id: row.donacion_id,
                    fecha_entrega: row.fecha_entrega
                }
            }));

            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    beneficiaries_with_deliveries: beneficiariesWithDeliveries,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            });
        }
    }
}
