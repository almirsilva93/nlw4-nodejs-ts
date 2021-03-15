import { Response, Request } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRespository";

class NpsController {
    async execute(request: Request, response: Response) {
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        });

        const detractor = surveyUsers.filter(
            (survey) => survey.value >= 0 && survey.value <= 6
        ).length;

        const promoters = surveyUsers.filter(
            (survey) => survey.value >= 9 && survey.value <= 10
        ).length;

        const passives = surveyUsers.filter(
            (survey) => survey.value >= 7 && survey.value <= 8
        ).length;

        const totalAnswers = surveyUsers.length;

        const calculate = Number(
            (((promoters - detractor) / totalAnswers) * 100).toFixed(2)
        );

        return response.json({
            detractor,
            promoters,
            passives,
            totalAnswers,
            nps: calculate
        });
    }
}



export { NpsController }
