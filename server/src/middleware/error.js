const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: 'Invalid or expired token',
      code: 'UNAUTHORIZED'
    })
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation error',
      details: Object.values(err.errors).map(e => e.message)
    })
  }

  if (err.code === 11000) {
    return res.status(400).json({ 
      error: 'Duplicate entry',
      field: Object.keys(err.keyPattern)[0]
    })
  }

  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

export { errorHandler }
