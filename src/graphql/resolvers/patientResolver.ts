import validator from "validator";
import AppError from "../../Customs/Errors/AppError";
import AuthMidlweare, { IHeader } from "../../middlewares/auth";
import patientData, { IPatient } from "../../models/patient_dataModel";
import dictionary, { IDictionaryModel } from "../../models/dictionaryModel";
import translation, { ITranslationModel } from "../../models/translationModel";
import sequelize from "sequelize/dist/lib/sequelize";
import { Op } from "sequelize/dist";
import Database from "./../../utils/database";
import Patient, { IPatientModel } from "./../../models/pacientModel";
import timeseriesData from "../../models/timeseries_dataModel";
import { IPatientInput, ITaimseriesInput } from "../types/patientTypes";

interface IPatientDataWIthIncludes {
  id: number;
  translation_dict_id: number;
  locale_id: number;
  name: string;
  description: string;
  key: string;
}

enum dictionaryDataTypes {
  illness = "illness",
  human_habits = "human_habits",
}

interface IDictionaryResponse extends IDictionaryModel {
  translation: ITranslationModel;
}

interface IPatientDataResponse extends IPatient {
  dictionary: IDictionaryResponse;
}

interface IPatientResponse extends IPatientModel {
  patient_data: IPatientDataResponse[];
}

export default {
  async addPatient(args: IPatientInput, request: IHeader) {
    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    const {
      name,
      age,
      weight,
      height,
      gender,
      bodyTemprature,
      totalCollesterol,
      timeSeries,
      habits,
    } = args.patientInput;
    const errors: string[] = [];

    if (validator.isEmpty(name)) {
      errors.push("Name required");
    }

    if (!validator.isNumeric(age.toString())) {
      errors.push("Wrong age");
    }

    if (!validator.isNumeric(weight.toString())) {
      errors.push("Wrong weight");
    }

    if (!validator.isNumeric(height.toString())) {
      errors.push("Wrong height");
    }

    if (!validator.isNumeric(gender.toString())) {
      errors.push("Gender required");
    }

    if (!validator.isNumeric(bodyTemprature.toString())) {
      errors.push("bodyTemprature required");
    }

    if (!validator.isNumeric(totalCollesterol.toString())) {
      errors.push("totalCollesterol required");
    }

    const {
      timeSeriesDate,
      activity,
      weakness,
      headacke,
      bpAbnormality,
      irregullarHeartbit,
      systolic,
      diastolic,
      pulse,
      oxygenSaturation,
    } = timeSeries;

    if (validator.isEmpty(timeSeriesDate)) {
      errors.push("timeSeriesDate required");
    }

    if (!validator.isNumeric(activity.toString())) {
      errors.push("activity required");
    }

    if (!validator.isBoolean(weakness.toString())) {
      errors.push("weakness required");
    }

    if (!validator.isBoolean(headacke.toString())) {
      errors.push("headacke required");
    }

    if (!validator.isBoolean(bpAbnormality.toString())) {
      errors.push("bpAbnormality required");
    }

    if (!validator.isBoolean(irregullarHeartbit.toString())) {
      errors.push("irregullarHeartbit required");
    }

    if (!validator.isNumeric(systolic.toString())) {
      errors.push("systolic required");
    }

    if (!validator.isNumeric(diastolic.toString())) {
      errors.push("diastolic required");
    }

    if (!validator.isNumeric(pulse.toString())) {
      errors.push("pulse required");
    }

    if (!validator.isNumeric(oxygenSaturation.toString())) {
      errors.push("oxygenSaturation required");
    }

    const Habits = habits.split("|");

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    return Database.transaction().then((t) => {
      return Patient.create(
        {
          name,
          age,
          weight,
          height,
          gender,
          user_id: parseInt(user.id, 10),
        },
        { transaction: t }
      )
        .then(async (u) => {
          return timeseriesData
            .create(
              {
                data_time: new Date(timeSeriesDate).toLocaleDateString(),
                irregular_heart_beat: irregullarHeartbit,
                systolic,
                diastolic,
                pulse,
                oxygen_saturation: oxygenSaturation,
                temperature: bodyTemprature,
                // @ts-ignore
                patient_id: parseInt(u.id, 10),
                user_id: user.id,
                status: 1,
                activity,
                weakness,
                headacke,
                bpAbnormality,
                irregullarHeartbit,
              },
              { transaction: t }
            )
            .then(async (pd) => {
              const pData = Habits.filter((n) => n).map((hd) => {
                return {
                  dict_id: parseInt(hd, 10),
                  // @ts-ignore
                  patient_id: parseInt(u.id, 10),
                };
              });
              console.log("--------------", pData);
              if (pData.length > 0) {
                return patientData
                  .bulkCreate(pData, { transaction: t })
                  .then(async (td) => {
                    t.commit();
                    return {
                      data: u,
                      succes: true,
                      errorMessage: [],
                      code: 200,
                    };
                  });
              } else {
                t.commit();
                return {
                  data: u,
                  succes: true,
                  errorMessage: [],
                  code: 200,
                };
              }
            });
        })
        .catch((err) => {
          console.log(err);
          t.rollback();
          const error = new AppError("Something went wrong");
          throw error;
        });
    });
  },

  async editPatient(args: IPatientInput, request: IHeader) {
    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    const {
      age,
      weight,
      height,
      gender,
      bodyTemprature,
      totalCollesterol,
      habits,
      patient_id,
    } = args.patientInput;
    const errors: string[] = [];

    if (!validator.isNumeric(patient_id.toString())) {
      errors.push("patient_id required");
    }

    if (!validator.isNumeric(age.toString())) {
      errors.push("Wrong age");
    }

    if (!validator.isNumeric(weight.toString())) {
      errors.push("Wrong weight");
    }

    if (!validator.isNumeric(height.toString())) {
      errors.push("Wrong height");
    }

    if (!validator.isNumeric(gender.toString())) {
      errors.push("Gender required");
    }

    if (!validator.isNumeric(bodyTemprature.toString())) {
      errors.push("bodyTemprature required");
    }

    if (!validator.isNumeric(totalCollesterol.toString())) {
      errors.push("totalCollesterol required");
    }

    const Habits = habits.split("|");

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    return Database.transaction().then((t) => {
      return Patient.update(
        {
          age,
          weight,
          height,
          gender,
        },
        {
          where: {
            id: patient_id,
          },
          transaction: t,
        }
      )
        .then(async (u) => {
          return patientData
            .destroy({
              where: {
                patient_id,
              },
            })
            .then(async (pd) => {
              const pData = Habits.filter((n) => n).map((hd) => {
                return {
                  dict_id: parseInt(hd, 10),
                  // @ts-ignore
                  patient_id,
                };
              });
              console.log("--------------", pData);
              if (pData.length > 0) {
                return patientData
                  .bulkCreate(pData, { transaction: t })
                  .then(async (td) => {
                    t.commit();
                    return {
                      succes: true,
                      errorMessage: [],
                      code: 200,
                    };
                  });
              } else {
                t.commit();
                return {
                  succes: true,
                  errorMessage: [],
                  code: 200,
                };
              }
            });
        })
        .catch((err) => {
          console.log(err);
          t.rollback();
          const error = new AppError("Something went wrong");
          throw error;
        });
    });
  },

  async addTimeSeries(args: ITaimseriesInput, request: IHeader) {
    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    const errors: string[] = [];

    const {
      timeSeriesDate,
      activity,
      weakness,
      headacke,
      bpAbnormality,
      irregullarHeartbit,
      systolic,
      diastolic,
      pulse,
      oxygenSaturation,
      patient_id,
    } = args.timeseriesInput;

    if (!validator.isNumeric(patient_id.toString())) {
      errors.push("patient_id required");
    }

    if (validator.isEmpty(timeSeriesDate)) {
      errors.push("timeSeriesDate required");
    }

    if (!validator.isNumeric(activity.toString())) {
      errors.push("activity required");
    }

    if (!validator.isBoolean(weakness.toString())) {
      errors.push("weakness required");
    }

    if (!validator.isBoolean(headacke.toString())) {
      errors.push("headacke required");
    }

    if (!validator.isBoolean(bpAbnormality.toString())) {
      errors.push("bpAbnormality required");
    }

    if (!validator.isBoolean(irregullarHeartbit.toString())) {
      errors.push("irregullarHeartbit required");
    }

    if (!validator.isNumeric(systolic.toString())) {
      errors.push("systolic required");
    }

    if (!validator.isNumeric(diastolic.toString())) {
      errors.push("diastolic required");
    }

    if (!validator.isNumeric(pulse.toString())) {
      errors.push("pulse required");
    }

    if (!validator.isNumeric(oxygenSaturation.toString())) {
      errors.push("oxygenSaturation required");
    }

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    return timeseriesData
      .create({
        patient_id,
        data_time: timeSeriesDate,
        systolic,
        diastolic,
        pulse,
        activity,
        weakness,
        headacke,
        bpAbnormality,
        irregullarHeartbit,
        oxygen_saturation: oxygenSaturation,
        user_id: user.id,
      })
      .then(async () => {
        return {
          succes: false,
          errorMessage: errors,
          code: 200,
        };
      })
      .catch((err) => {
        console.log(err);
        const error = new AppError("Something went wrong");
        throw error;
      });
  },

  async getPatients({}, request: IHeader) {
    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    return Patient.findAll({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: patientData,
          attributes: ["id", "dict_id", "patient_id"],
        },
        {
          model: timeseriesData,
          attributes: [
            "id",
            "data_time",
            "systolic",
            "diastolic",
            "pulse",
            "oxygen_saturation",
            "temperature",
            "irregular_heart_beat",
            "activity",
            "weakness",
            "headacke",
            "bpAbnormality",
            "irregullarHeartbit",
          ],
        },
      ],
      attributes: [
        "id",
        "name",
        "age",
        "gender",
        "height",
        "weight",
        "user_id",
        "create_time",
      ],
    })
      .then((u) => {
        return {
          data: u,
          succes: true,
          errorMessage: [] as string[],
          code: 200,
        };
      })
      .catch(() => {
        const error = new AppError("Something went wrong");
        throw error;
      });
  },

  async getPatient({ patient_id }: { patient_id: number }, request: IHeader) {
    const errors: string[] = [];

    if (!validator.isNumeric(patient_id.toString())) {
      errors.push("patient_id required");
    }

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    return Patient.findOne({
      where: {
        user_id: user.id,
        id: patient_id,
      },
      include: [
        {
          model: patientData,
          attributes: ["id", "dict_id", "patient_id"],
          include: [
            {
              model: dictionary,
              attributes: ["key"],
              include: [
                {
                  model: translation,
                  where: { locale_id: 2 },
                  attributes: ["name"],
                },
              ],
            },
          ],
        },
        {
          model: timeseriesData,
          attributes: [
            "id",
            "data_time",
            "systolic",
            "diastolic",
            "pulse",
            "oxygen_saturation",
            "temperature",
            "irregular_heart_beat",
            "activity",
            "weakness",
            "headacke",
            "bpAbnormality",
            "irregullarHeartbit",
          ],
        },
      ],
      attributes: [
        "id",
        "name",
        "age",
        "gender",
        "height",
        "weight",
        "user_id",
      ],
    })
      .then((u) => {
        const _user = u as unknown as IPatientResponse;
        return {
          data: _user,
          succes: true,
          errorMessage: [] as string[],
          code: 200,
        };
      })
      .catch((err) => {
        console.log(err);
        const error = new AppError("Something went wrong");
        throw error;
      });
  },

  async getGabitsAndHilnsess({}, request: IHeader) {
    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    const patient_data = (await dictionary.findAll({
      include: [
        {
          model: translation,
          where: { locale_id: 1 },
          attributes: [
            "translation_dict_id",
            "locale_id",
            "name",
            "description",
          ],
        },
      ],
      attributes: [
        [sequelize.col("translation.id"), "id"],
        [
          sequelize.col("translation.translation_dict_id"),
          "translation_dict_id",
        ],
        [sequelize.col("translation.locale_id"), "locale_id"],
        [sequelize.col("translation.name"), "name"],
        [sequelize.col("translation.description"), "description"],
        "key",
      ],
      raw: true,
      where: { parent_key_id: { [Op.is]: null } },
    })) as unknown as IPatientDataWIthIncludes[];

    const hilness = patient_data.filter((data) =>
      data.key.startsWith(dictionaryDataTypes.illness)
    );
    const human_habits = patient_data.filter((data) =>
      data.key.startsWith(dictionaryDataTypes.human_habits)
    );

    return {
      data: {
        hilness,
        human_habits,
      },
      succes: true,
      errorMessage: [] as string[],
      code: 200,
    };
  },

  async getDictionary({}, request: IHeader) {
    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    const dictionary_data = (await dictionary.findAll({
      include: [
        {
          model: translation,
          where: { locale_id: 2 },
          attributes: [
            "translation_dict_id",
            "locale_id",
            "name",
            "description",
          ],
        },
      ],
      attributes: [
        [sequelize.col("translation.id"), "id"],
        [
          sequelize.col("translation.translation_dict_id"),
          "translation_dict_id",
        ],
        [sequelize.col("translation.locale_id"), "locale_id"],
        [sequelize.col("translation.name"), "name"],
        [sequelize.col("translation.description"), "description"],
      ],
      raw: true,
    })) as unknown as IPatientDataWIthIncludes[];

    const DictionaryArray: IPatientDataWIthIncludes[] = [];

    dictionary_data.map((pData) => {
      DictionaryArray.push({
        id: pData.id,
        translation_dict_id: pData.translation_dict_id,
        locale_id: pData.locale_id,
        name: pData.name,
        description: pData.description,
        key: pData.key,
      });
    });

    return {
      data: DictionaryArray,
      succes: true,
      errorMessage: [] as string[],
      code: 200,
    };
  },

  async deletePatientTimeseries({ t_id }: { t_id: number }, request: IHeader) {
    const errors: string[] = [];

    if (!validator.isNumeric(t_id.toString())) {
      errors.push("t_id required");
    }

    if (errors.length > 0) {
      return {
        succes: false,
        errorMessage: errors,
        code: 200,
      };
    }

    const user = await AuthMidlweare(request);

    if (!user.id) {
      const error = new AppError("Authentification error");
      error.code = 401;
      throw error;
    }

    return timeseriesData
      .destroy({ where: { id: t_id } })
      .then((res) => {
        return {
          succes: true,
          errorMessage: [],
          code: 200,
        };
      })
      .catch((err) => {
        console.log(err);
        const error = new AppError("Something went wrong");
        throw error;
      });
  },
};
