"use server"

import { WebPmbContent, sequelize } from "@/database/models"

export const getContentPMB = async (type) => {
  try {
    return await WebPmbContent.findAll({
      where: { type, isActive: true, isDelete: false },
      attributes: ["title", [sequelize.literal("CAST(detail AS CHAR CHARSET utf8)"), "detail"]],
      raw: true,
      order: [["position", "ASC"]],
    })
  } catch (error) {
    console.error(error)
    throw error
  }
}
