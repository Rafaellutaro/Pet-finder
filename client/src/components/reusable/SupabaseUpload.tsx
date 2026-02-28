import supabase from "../../SupabaseClient";

type supabase = {
    fileName: string,
    file: any,
    bucketName: string
}

export default async function SupabaseUpload({ fileName, file, bucketName }: supabase) {
    const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false
        });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;
    return imageUrl
}