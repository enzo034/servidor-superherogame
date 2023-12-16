//Error genérico para trycatch

const catchError = (error) => {
    console.log(error);
    return res.status(500).json({
        message: "Hubo un error al intentar devolver los favoritos",
        error: error.message
    });
}

export default catchError;