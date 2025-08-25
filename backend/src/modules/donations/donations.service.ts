//TENER EN CUENTA QUE AL HACER UNA ENTREGA DE UN PRODUCTO, EL CAMPO ENTREGADO CAMBIA A TRUE
import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertDonationDto } from './dto/insert-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { DeleteDonationDto } from './dto/delete-donation.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class DonationsService {
    constructor(private databaseService: DatabaseService) { };

    //CRUD SENCILLO (CREATE - READ - UPDATE - DELETE)

    async insertDonation(dto: InsertDonationDto) {
        const { id_donante, tipo_donacion, valor_estimado, metodo_pago, detalle_donacion, url_image, disponible } = dto;

        const query = `INSERT INTO public.donaciones (id_donante, tipo_donacion, valor_estimado, metodo_pago, detalle_donacion, url_image, disponible, fecha_donacion)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, now())
                    RETURNING id_donacion, id_donante, tipo_donacion, valor_estimado, metodo_pago, detalle_donacion, url_image, disponible, fecha_donacion;`;
        const value = [id_donante, tipo_donacion, valor_estimado, metodo_pago, detalle_donacion, url_image, true];
        try {
            const result = await this.databaseService.query(query, value);
            const donacion = result.rows[0]
            return {
                p_messaje: 'Donación ingresada correctamente',
                p_status: true,
                p_data: {
                    sub: donacion.id_donacion,
                    donador: donacion.id_donante,
                    tipo: donacion.tipo_donacion,
                    monto: donacion.valor_estimado,
                    metodo: donacion.metodo_pago,
                    descripcion: donacion.detalle_donacion,
                    image: donacion.url_image,
                    disponible: donacion.disponible,
                    fecha: donacion.fecha_donacion,
                }
            }
        } catch (error) {
            return {
                p_messaje: error.message,
                p_data: {}
            }
        }
    }

    async getDonations(res) {
        const query = `SELECT id_donacion, id_donante, tipo_donacion, valor_estimado, metodo_pago, detalle_donacion, url_image, disponible, fecha_donacion
                    FROM public.donaciones;`;
        const values = [];
        try {
            const result = await this.databaseService.query(query, values);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    donations: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            })
        }
    }

    async updateDonation(dto: UpdateDonationDto) {
        const { id_donacion, id_donante, tipo_donacion, valor_estimado, metodo_pago, detalle_donacion, url_image } = dto;

        const query = `
        UPDATE public.donaciones
        SET
            id_donante = $1,
            tipo_donacion = $2,
            valor_estimado = $3,
            metodo_pago = $4,
            detalle_donacion = $5,
            url_image = $6
        WHERE id_donacion = $7
        RETURNING id_donacion, id_donante, tipo_donacion, valor_estimado, metodo_pago, detalle_donacion, url_image, disponible;`;

        const values = [id_donante, tipo_donacion, valor_estimado, metodo_pago, detalle_donacion, url_image, id_donacion];

        try {
            const result = await this.databaseService.query(query, values);
            const donacion = result.rows[0];

            return {
                p_messaje: 'Donación actualizada correctamente',
                p_status: true,
                p_data: {
                    id_donacion: donacion.id_donacion,
                    donador: donacion.id_donante,
                    tipo: donacion.tipo_donacion,
                    monto: donacion.valor_estimado,
                    metodo: donacion.metodo_pago,
                    detalle: donacion.detalle_donacion,
                    image: donacion.url_image,
                    disponible: donacion.disponible,
                }
            };
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            };
        }
    }

    async updateDonationAvailability(dto: UpdateAvailabilityDto) {
        const { disponible, id_donacion } = dto;
        const query = `UPDATE public.donaciones
                    SET disponible = $1
                    WHERE id_donacion = $2
                    RETURNING disponible;`;
        const values = [disponible, id_donacion];
        try {
            const result = await this.databaseService.query(query, values);
            const donacion = result.rows[0]
            return {
                p_messaje: 'Disponibilidad actualizada correctamente',
                p_status: true,
                p_data: {
                    disponible: donacion.disponible,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteDonation(dto: DeleteDonationDto) {
        const { id_donacion } = dto;
        const query = `DELETE FROM public.donaciones
                    WHERE id_donacion = $1`;
        const values = [id_donacion];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_messaje: 'Donación eliminada correctamente',
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
    async getDonationsWithDonors(res) {
        const query = `SELECT 
                    d.id_donacion,
                    d.tipo_donacion,
                    d.valor_estimado,
                    d.metodo_pago,
                    d.detalle_donacion,
                    d.url_image,
                    d.fecha_donacion,
                    d.disponible,
                    dn.id_donante,
                    dn.nombres,
                    dn.numero_identificacion,
                    dn.telefono,
                    dn.fecha_registro
                FROM public.donaciones d
                INNER JOIN public.donantes dn ON d.id_donante = dn.id_donante
                ORDER BY d.disponible DESC;`;
        try {
            const result = await this.databaseService.query(query, []);

            const donationsWithDonor = result.rows.map(row => ({
                id_donacion: row.id_donacion,
                tipo_donacion: row.tipo_donacion,
                valor_estimado: row.valor_estimado,
                metodo_pago: row.metodo_pago,
                detalle_donacion: row.detalle_donacion,
                url_image: row.url_image,
                fecha_donacion: row.fecha_donacion,
                disponible: row.disponible,
                donante: {
                    id_donante: row.id_donante,
                    nombres: row.nombres,
                    numero_identificacion: row.numero_identificacion,
                    telefono: row.telefono,
                    fecha_registro: row.fecha_registro
                }
            }));

            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    donations_with_donor: donationsWithDonor
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
