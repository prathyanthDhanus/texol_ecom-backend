interface Config {
  db: {
    url: string;
  };
  server: {
    port: number;
    env: string;
  };
  jwt: {
    secret: string;
    adminSecret: string;
    expiresIn: string;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
  client: {
    url: string;
  };
}

const config: Config = {
  db: {
    url: process.env.MONGODB_URL || "mongodb://127.0.0.1/e-commerce_texol",
  },
  server: {
    port: parseInt(process.env.PORT || "5000", 10),
    env: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: process.env.USER_SECRET_KEY || "",
    adminSecret: process.env.ADMIN_SECRET_KEY || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  client: {
    url: process.env.CLIENT_URL || "https://superlative-seahorse-a01c14.netlify.app",
  },
};

// Validate required configuration
if (!config.jwt.secret || !config.jwt.adminSecret) {
  throw new Error("JWT secrets must be defined in environment variables");
}

export default config;
