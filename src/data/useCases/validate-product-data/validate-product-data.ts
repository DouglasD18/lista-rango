import { Validated } from "@/domain/models";
import { ValidateProductData } from "@/domain/useCases";
import { InvalidParamError, MissingParamError } from "@/presentation/errors";

export class ValidateProductDataAdapter implements ValidateProductData {
  handle(data: any): Validated {
    const fields = ["photo", "name", "price", "category"];
    const promotionFields = ["description", "price", "daysAndHours"];
    const categorys = ["candy", "salty", "juice", "dish"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const regexHours = /^([01]\d|2[0-3]):([0-5]\d)$/;

    for (const field of fields) {
      if (!data[field]) {
        return {
          isValid: false,
          error: new MissingParamError(field)
        }
      }
    }

    if (typeof data.photo !== "string") {
      return {
        isValid: false,
        error: new InvalidParamError("photo", "'photo' must be a string!")
      } 

    } else if (data.photo.trim().length < 7) {
      return {
        isValid: false,
        error: new InvalidParamError("photo", "product must have a photo!")
      }
    } else if (!categorys.includes(data.category)) {
      return {
        isValid: false,
        error: new InvalidParamError("category", "'category' must be a valid category!")
      }
    } else if (typeof data.price !== "number") {
      return {
        isValid: false,
        error: new InvalidParamError("price", "'price' must be a number!")
      }
    } else if (data.price < 0) {
      return {
        isValid: false,
        error: new InvalidParamError("price", "'price' must be a positive number!")
      }
    } else if (typeof data.name !== "string") {
      return {
        isValid: false,
        error: new InvalidParamError("name", "'name' must be a string!")
      } 

    } else if (data.name.trim().length < 7) {
      return {
        isValid: false,
        error: new InvalidParamError("name", "product must have a name!")
      }
    }

    if (data.promotion) {
      for (const field of promotionFields) {
        if (!data.promotion[field]) {
          return {
            isValid: false,
            error: new MissingParamError(`promotion ${field}`)
          }
        }
      }

      if (typeof data.promotion.price !== "number") {
        return {
          isValid: false,
          error: new InvalidParamError("promotion price", "'price' must be a number!")
        }
      } else if (data.promotion.price < 0) {
        return {
          isValid: false,
          error: new InvalidParamError("promotion price", "'price' must be a positive number!")
        }
      } else if (typeof data.promotion.description !== "string") {
        return {
          isValid: false,
          error: new InvalidParamError("promotion description", "'description' must be a string!")
        } 
  
      } else if (data.promotion.description.trim().length < 7) {
        return {
          isValid: false,
          error: new InvalidParamError("promotion description", "promotion must have a description!")
        }
      } else if (typeof data.promotion.daysAndHours !== "object") {
        return {
          isValid: false,
          error: new InvalidParamError("promotion daysAndHours", "'daysAndHours' must be a object!")
        }
      } 

      const { daysAndHours } = data.promotion;
      
      for (const day of Object.keys(daysAndHours)) {
        if (!days.includes(day)) {
          return {
            isValid: false,
            error: new InvalidParamError("promotion daysAndHours", "'daysAndHours' must have a valid day!")
          }
        } else if (daysAndHours[day].length !== 2) {
          return {
            isValid: false,
            error: new InvalidParamError("promotion daysAndHours", "'daysAndHours' must have to hours for day!")
          }
        } else if (!regexHours.test(daysAndHours[day][0]) || !regexHours.test(daysAndHours[day][1])) {
          return {
            isValid: false,
            error: new InvalidParamError("promotion daysAndHours", "'hours' must be a valid time!")
          }
        } 

        const [start, end] = daysAndHours[day];
        const [startHour, startMinute] = start.split(":");
        const [endHour, endMinute] = end.split(":");
        
        if ((Number(endHour) * 60 + Number(endMinute)) - (Number(startHour) * 60 + Number(startMinute)) < 15) {
          return {
            isValid: false,
            error: new InvalidParamError("promotion daysAndHours", "'hours' must have at least 15 minutes apart!")
          }
        }
      }

    }

    return {
      isValid: true
    }
  }
  
}
