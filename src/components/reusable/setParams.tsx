import type { SetURLSearchParams } from "react-router-dom";

const updateParams = (updates: Record<string, string>, setSearchParams: SetURLSearchParams) => {
        setSearchParams(prev => {
            const params = new URLSearchParams(prev.toString());

            Object.entries(updates).forEach(([key, value]) => {
                params.set(key, value);
            });

            return params;
        });
    };

export default updateParams;