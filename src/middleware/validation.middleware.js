import ApiError from "../utils/ApiError.js";

// const validate = (validator) => {
//   return (req, res, next) => {
//     try {
//       validator(req.body);
//       next();
//     } catch (error) {
//       if (error instanceof ApiError) {
//         return next(error);
//       }

//       return next(new ApiError(400, error.message));
//     }
//   };
// };

const validate = (validator) => {
  return (req, res, next) => {
    try {
      validator(req);

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        return next(error);
      }

      return next(new ApiError(400, error.message));
    }
  };
};

export default validate;
