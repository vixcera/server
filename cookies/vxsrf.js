import csurf from "csurf"

export const protectvxsrf = csurf({
  cookie : {
      httpOnly : true,
      secure   : true,
      key      : "vxsrf",
      sameSite : "none",
  }
})

export const getvxsrf = async (request, response) => {
    return response.status(200).json(request.csrfToken())
}

export const checkvxsrf = async (request, response) => {
  const cookievxsrf = request.cookies.vxsrf
  if (!cookievxsrf) return response.sendStatus(404)
  return response.sendStatus(200)
}

export const handlevxsrf = (err, req, res, next) => {
    if (err && err.code === 'EBADCSRFTOKEN') {
      return res.status(403).json("invalid vxsrf token");
    }
    next(err);
};