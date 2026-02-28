import type { FormFields } from "../../Interfaces/zodSchema";
import type { UseFormHandleSubmit, UseFormRegister, UseFormWatch } from "react-hook-form";
import "../../assets/css/PetPersonality.css"

type dogPersonality = {
    register: UseFormRegister<FormFields>;
    watch: UseFormWatch<FormFields>;
    handleSubmit: UseFormHandleSubmit<FormFields>;
    onContinue: () => void;
    isSubmitting: boolean;
}

export default function PetPersonality({ register, watch, handleSubmit, onContinue, isSubmitting }: dogPersonality) {
    return (
        <section className="dogPersonality-section">
            <div className="dogPersonality-container">
                <form onSubmit={handleSubmit(onContinue)}>
                    <h1>Personalidade do Pet</h1>

                    <div className="personality-row">
                        <div className="personality-group">
                            <label> Brincalhão: {watch("playful")}% </label>
                            <input type="range" min={0} max={100} step={5} {...register("playful", { valueAsNumber: true, })} />
                        </div>

                        <div className="personality-group">
                            <label> Energetico: {watch("energetic")}% </label>
                            <input type="range" min={0} max={100} step={5} {...register("energetic", { valueAsNumber: true, })} />
                        </div>
                    </div>

                    <div className="personality-row">
                        <div className="personality-group">
                            <label> Amigavel: {watch("friendly")}% </label>
                            <input type="range" min={0} max={100} step={5} {...register("friendly", { valueAsNumber: true, })} />
                        </div>

                        <div className="personality-group">
                            <label> Inteligente: {watch("smart")}% </label>
                            <input type="range" min={0} max={100} step={5} {...register("smart", { valueAsNumber: true, })} />
                        </div>
                    </div>

                    <div className="personality-row">
                        <div className="personality-group">
                            <label> Leal: {watch("loyal")}% </label>
                            <input type="range" min={0} max={100} step={5} {...register("loyal", { valueAsNumber: true, })} />
                        </div>
                    </div>

                    <button className="PersonalitySubmit" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Avançando..." : "Avançar"}
                    </button>
                </form>
            </div>
        </section>
    )
}
