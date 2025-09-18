import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function capitalizeString(string, onlyFirstLetter = true) {
  if (onlyFirstLetter) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  } else {
    return sentence
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }
}

export function schemaValidation(schema, values) {
  const { error, value } = schema.validate(values, {
    abortEarly: false,
  })

  if (error) {
    let errorData = {}
    let touched = {}
    for (let i = 0; i < (error?.details || []).length; i++) {
      errorData[error.details[i].context.key] = error.details[i].message.replace(/\"/g, "")
      touched[error.details[i].context.key] = true
    }
    return { error: errorData, touched }
  }

  return { value }
}

export function getFieldValue(event) {
  const getMapValue = {
    text: event.target.value,
    password: event.target.value,
    checkbox: event.target.checked,
  }

  return [event.target.name, getMapValue[event.target.type]]
}

export function sequelizeDataParser(data) {
  return JSON.parse(JSON.stringify(data))
}

export function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

export function waktuHariIni() {
  const jam = new Date().getHours()
  return jam < 4 ? "Malam" : jam < 12 ? "Pagi" : jam < 17 ? "Siang" : jam < 20 ? "Sore" : "Malam"
}

const isPrecisionDecimalValue = (value, precision) => {
  const pattern = new RegExp("^-?\\d+(\\.\\d{1," + precision + "})?$")
  return pattern.test(value)
}

export function validateNumberLengthAndPrecision(value, helper, min = 0, max = 0, precision = null) {
  // ONLY FOR JOI VALIDATION
  let maxValue = max > 12 ? 12 : max
  let minValue = min > 12 ? 12 : min
  if (minValue === maxValue && parseInt(value).toString().length !== maxValue) {
    return helper.message(`Panjang {{#label}} harus ${maxValue} digit`)
  } else {
    if (parseInt(value).toString().length < minValue) {
      return helper.message(`Panjang {{#label}} harus setidaknya ${minValue} digit`)
    }
    if (parseInt(value).toString().length > maxValue) {
      return helper.message(`Panjang digit {{#label}} harus lebih kecil atau sama dengan ${maxValue}`)
    }
  }

  if (precision && !isPrecisionDecimalValue(value, precision)) {
    return helper.message(`{{#label}} nilai setelah koma maksimal ${precision} digit`)
  }

  return value
}

export async function convertFileToBase64(file) {
  try {
    const data = await new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = () => {
        const base64Data = reader.result
        resolve(base64Data)
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsDataURL(file)
    })
    return data
  } catch {
    return null
  }
}

export function getBase64MimeType(base64) {
  const mime = base64.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)
  return mime ? mime[1] : ""
}

export function getClassNameViewBase64(base64) {
  if (!base64) return ""
  const map = {
    application: "w-full h-full",
    image: "max-w-[100%]",
  }

  return map[getBase64MimeType(base64).split("/")[0]]
}

export function formatRelativeTime(date) {
  const now = new Date()
  const diffMilliseconds = now - date
  const options = { year: "numeric", month: "long", day: "numeric" }

  // Deteksi waktu yang berbeda dalam milidetik
  if (diffMilliseconds < 60 * 1000) {
    return "Baru saja"
  } else if (diffMilliseconds < 60 * 60 * 1000) {
    const minutes = Math.floor(diffMilliseconds / (60 * 1000))
    return `${minutes} menit yang lalu`
  } else if (diffMilliseconds < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diffMilliseconds / (60 * 60 * 1000))
    return `${hours} jam yang lalu`
  } else if (diffMilliseconds < 48 * 60 * 60 * 1000) {
    return `Kemarin`
  } else if (diffMilliseconds < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diffMilliseconds / (24 * 60 * 60 * 1000))
    return `${days} hari yang lalu (${date.toLocaleDateString(undefined, options)})`
  } else if (diffMilliseconds < 30 * 24 * 60 * 60 * 1000) {
    const weeks = Math.floor(diffMilliseconds / (7 * 24 * 60 * 60 * 1000))
    return `${weeks} minggu yang lalu (${date.toLocaleDateString(undefined, options)})`
  } else if (diffMilliseconds < 365 * 24 * 60 * 60 * 1000) {
    const months = Math.floor(diffMilliseconds / (30 * 24 * 60 * 60 * 1000))
    return `${months} bulan yang lalu (${date.toLocaleDateString(undefined, options)})`
  }

  // Default: Tampilkan tanggal lengkap jika tidak sesuai kriteria di atas
  return date.toDateString()
}

export function dataURItoBlob(dataURI) {
  let byteString = atob(dataURI.split(",")[1])
  let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0]
  let ab = new ArrayBuffer(byteString.length)
  let ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  let blob = new Blob([ab], { type: mimeString })
  return blob
}

export function hitungUmur(tanggalLahir) {
  const hariIni = new Date()
  const tanggalLahirObj = new Date(tanggalLahir)

  return (
    hariIni.getFullYear() -
    tanggalLahirObj.getFullYear() -
    (hariIni.getMonth() < tanggalLahirObj.getMonth() || (hariIni.getMonth() === tanggalLahirObj.getMonth() && hariIni.getDate() < tanggalLahirObj.getDate()))
  )
}

export function compareData(data1, data2) {
  var differences = []

  for (var key in data1) {
    if (data1.hasOwnProperty(key)) {
      if (key in data2) {
        if (data1[key] !== data2[key]) {
          differences.push(key)
        }
      } else {
        differences.push(key)
      }
    }
  }

  for (var key in data2) {
    if (data2.hasOwnProperty(key) && !(key in data1)) {
      differences.push(key)
    }
  }

  return differences
}

export function getYYYYMMDD(date, reverse = false) {
  if (!date) return null
  date = new Date(date)
  let year = date.getFullYear()
  let month = String(date.getMonth() + 1).padStart(2, "0") // Tambahkan 0 di depan jika bulan kurang dari 10
  let day = String(date.getDate()).padStart(2, "0")

  return reverse ? `${day}-${month}-${year}` : `${year}-${month}-${day}`
}

export function getTime(date) {
  if (!date) return null
  date = new Date(date)
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const seconds = date.getSeconds().toString().padStart(2, "0")
  return hours + ":" + minutes + ":" + seconds
}

export function validateTimeRanges(start1, end1, start2, end2) {
  const date1 = new Date(`1990-01-01 ${start1}`).getTime()
  const date2 = new Date(`1990-01-01 ${end1}`).getTime()
  const date3 = new Date(`1990-01-01 ${start2}`).getTime()
  const date4 = new Date(`1990-01-01 ${end2}`).getTime()

  return date1 < date4 && date2 > date3
}

export function formatDate(date) {
  const options = { day: "2-digit", month: "long", year: "numeric" }
  const formattedDate = new Intl.DateTimeFormat("id-ID", options).format(date)
  return formattedDate
}

export function getYearListAroundDate(inputDate) {
  let inputYear = new Date(inputDate).getFullYear()
  let years = []
  for (let i = inputYear - 10; i <= inputYear + 10; i++) {
    years.push({ value: i, label: i })
  }
  return years
}

export function findArrayDifference(first, second) {
  const positionMap = new Map()
  second.forEach((item) => {
    positionMap.set(item.id, item.position)
  })

  return first
    .map((item) => {
      const newPosition = positionMap.get(item.id)

      if (newPosition !== undefined && newPosition !== item.position) {
        return {
          id: item.id,
          judul: item.judul,
          detail: item.detail,
          oldPosition: item.position,
          newPosition: newPosition,
        }
      }

      return null
    })
    .filter(Boolean)
}

export function getOptionDropdownRange({ first = 1, last = 10, callbackFuncTemplateLabel = (i) => i }) {
  let result = []
  for (let i = first; i <= last; i++) {
    result.push({ label: callbackFuncTemplateLabel(i), value: i })
  }
  return result
}