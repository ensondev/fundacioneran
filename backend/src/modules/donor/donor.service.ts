import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertDonorDto } from './dto/insert-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { DeleteDonorDto } from './dto/delete-donor.dto';

@Injectable()
export class DonorService {
    constructor(private databaseService: DatabaseService) { };

    //CRUD SENCILLO (CREATE - READ - UPDATE - DELETE)

    async registerDonor(dto: InsertDonorDto) {
        const { nombres, numero_identificacion, telefono } = dto;
        const query = `INSERT INTO public.donantes(nombres, numero_identificacion, telefono, fecha_registro)
                    VALUES($1, $2, $3, now()) RETURNING id_donante, nombres, numero_identificacion, telefono, fecha_registro`;
        const values = [nombres, numero_identificacion, telefono];
        try {
            const result = await this.databaseService.query(query, values);
            const donor = result.rows[0];
            return {
                p_message: 'Donador registrado correctamente',
                p_status: true,
                p_data: {
                    sub: donor.id_donante,
                    donador: donor.nombres,
                    cedula: donor.numero_identificacion,
                    telefono: donor.telefono,
                    registrado: donor.fecha_registro
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getDonors(res) {
        const query = `SELECT id_donante, nombres, numero_identificacion, telefono, fecha_registro FROM public.donantes;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_messaje: null,
                p_status: true,
                p_data: {
                    donors: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            })
        }
    }

    async getDonorByCedula(req, res) {
        const { numero_identificacion } = req.body;
        const query = `SELECT id_donante, nombres, numero_identificacion, telefono, fecha_registro FROM public.donantes WHERE numero_identificacion = $1;`;
        const value = [numero_identificacion];
        try {
            const result = await this.databaseService.query(query, value);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    p_message: 'Donante no encontrado',
                    p_status: false,
                    p_data: { donor: [] }
                });
            }

            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    donor: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_status: false,
                p_data: {}
            });
        }
    }

    async updateDonor(dto: UpdateDonorDto) {
        const { nombres, numero_identificacion, telefono, id_donante } = dto;
        const query = `UPDATE public.donantes 
                    SET nombres = $1, numero_identificacion = $2, telefono = $3
                    WHERE id_donante = $4
                    RETURNING nombres, numero_identificacion, telefono;`;
        const values = [nombres, numero_identificacion, telefono, id_donante];
        try {
            const result = await this.databaseService.query(query, values);
            const donor = result.rows[0];
            return {
                p_message: 'Donador actualizado correctamente',
                p_status: true,
                p_data: {
                    donador: donor.nombres,
                    cedula: donor.numero_identificacion,
                    telefono: donor.telefono
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteDonor(dto: DeleteDonorDto) {
        const { id_donante } = dto;
        const query = `DELETE FROM public.donantes WHERE id_donante = $1;`;
        const values = [id_donante];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_message: 'Donador eliminado correctamente',
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
}
