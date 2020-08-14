import { Request, Response } from "express";

import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHoursToMinutes";

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController {
    async index(req: Request, res: Response) {
        const filters = req.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if (!subject || !week_day || !time) {
            return res
                .status(400)
                .json({ error: "Missing filter to search classes!" });
        }

        const timeInMinutes = convertHourToMinutes(time);

        const classes = await db("classes")
            .whereExists(function () {
                this.select("classes_schedule.*")
                    .from("class_schedule")
                    .whereRaw("`class_schedule`.`class_id` = `classes`.`id`")
                    .whereRaw("`class_schedule`.`week_day` = ??", [
                        Number(week_day)
                    ])
                    .whereRaw("`class_schedule`.`from` <= ??", [timeInMinutes])
                    .whereRaw("`class_schedule`.`to` > ??", [timeInMinutes]);
            })
            .where("classes.subject", "=", subject)
            .join("users", "classes.user_id", "=", "users.id")
            .select(["classes.*", "users.*"]);

        return res.send(200).json({ payload: classes });
    }

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;

        const trx = await db.transaction();

        try {
            const insertedUserIds = await trx("users").insert({
                name,
                avatar,
                whatsapp,
                bio
            });

            const user_id = insertedUserIds[0];

            const insertedClassesIds = await trx("classes").insert({
                subject,
                cost,
                schedule,
                user_id
            });

            const class_id = insertedClassesIds[0];

            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to)
                };
            });

            await trx("class_schedule").insert(classSchedule);

            await trx.commit();

            return response.status(201).json();
        } catch (err) {
            await trx.rollback();
            return response
                .status(500)
                .json({ error: "Internal server error" });
        }
    }
}
