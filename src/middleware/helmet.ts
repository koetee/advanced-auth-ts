import helmet from "helmet";

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "example.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "example.com"],
      imgSrc: ["'self'", "data:"],
    },
  },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  referrerPolicy: { policy: "same-origin" },
  hsts: { maxAge: 31536000, includeSubDomains: true },
});

export default helmetMiddleware;
