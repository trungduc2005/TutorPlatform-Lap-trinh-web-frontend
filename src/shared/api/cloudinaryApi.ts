interface CloudinaryUploadResponse {
    secure_url: string;
}

export async function uploadAvatarToCloudinary(file: File): Promise<string> {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim();

    if (!cloudName || !uploadPreset) {
        throw new Error("Thiếu cấu hình Cloudinary");
    }

    if (!file.type.startsWith("image/")) {
        throw new Error("Vui lòng chọn file ảnh");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Upload avatar thất bại");
    }

    const data = (await response.json()) as CloudinaryUploadResponse;
    return data.secure_url;
}
