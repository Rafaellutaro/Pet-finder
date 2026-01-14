import type { FormFields } from "../../Interfaces/zodSchema";
import type { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

type petFavorite = {
    register: UseFormRegister<FormFields>;
    handleSubmit: UseFormHandleSubmit<FormFields>;
    onSubmit: (data: any) => Promise<void>
    isSubmitting: boolean;
}

export default function PetFavorite({register, handleSubmit, onSubmit, isSubmitting }: petFavorite){
    return (
        <section className="favorite-section">
            <div className="favorite-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Favoritos</h1>

                    <div className="favorite-row">
                        <div className="favorite-group">
                            <label>Brinquedo Favorito:</label>
                            <input type="text" {...register("toy", { required: true })}/>
                        </div>

                        <div className="favorite-group">
                            <label>Comida Favorita:</label>
                            <input type="text" {...register("food", { required: true })}/>
                        </div>
                    </div>

                    <div className="favorite-row">
                        <div className="favorite-group">
                            <label>Lugar de Brincar Favorito:</label>
                            <input type="text" {...register("playPlace", { required: true })}/>
                        </div>

                        <div className="favorite-group">
                            <label>Lugar de Dormir Favorito:</label>
                            <input type="text" {...register("sleepPlace", { required: true })}/>
                        </div>
                    </div>

                    <button className="FavoritoBtn" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Avançando..." : "Avançar"}
                    </button>
                </form>
            </div>
        </section>
    )
}