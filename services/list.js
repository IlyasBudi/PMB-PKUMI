"use server"
import { Enumeration, EnumerationType, StudyProgram } from "@/database/models"
import { ENUMERATION_TYPE_STUDY_LEVEL } from "@/lib/constants"

export const getListEducation = async () => {
  try {
    return await Enumeration.findAll({
      where: { isActive: true },
      attributes: [
        ["id", "value"],
        ["name", "label"],
      ],
      include: [{ model: EnumerationType, attributes: [], required: true, where: { code: ENUMERATION_TYPE_STUDY_LEVEL, isActive: true } }],
      raw: true,
      order: [["code", "ASC"]],
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const getListProgramStudy = async () => {
  try {
    return await StudyProgram.findAll({
      where: { isDelete: false },
      attributes: [
        ["id", "value"],
        ["name", "label"],
      ],
      raw: true,
      order: [["code", "ASC"]],
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
