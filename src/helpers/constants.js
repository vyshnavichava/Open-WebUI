export const AI = {
  SYSTEM_PROMPT: `You are a helpful AI assistant.`,
  MAX_MESSAGE_LENGTH: 4000,
  DEFAULT_MODEL: "llama-3.1-70b-versatile",
};

export const USER = {
  DEFAULT_AVATAR: "/userAvatar.png",
  MAX_NAME_LENGTH: 50,
};

export const UPLOADS = {
  SUPPORTED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  MAX_FILE_SIZE_MB: 10,
  CLOUDINARY_FOLDER: "ObsidianGPT",
};

export const MESSAGES = {
  MAX_RECENT: 50,
};

export const APP = {
  NAME: "ObsidianGPT-ChatGPT Clone",
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
};
