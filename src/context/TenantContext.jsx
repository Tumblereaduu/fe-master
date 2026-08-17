import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { getCurrentTenant } from "../services/tenantServices";

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {

    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadTenant();
    }, []);

    const loadTenant = async () => {
        try {
            setLoading(true);
            setError(null);

            const response =
                await getCurrentTenant();

            setTenant(response.data);

            // Optional: apply branding
            if (response.data.primary_color) {
                document.documentElement.style.setProperty(
                    "--tenant-primary",
                    response.data.primary_color
                );
            }

        } catch (err) {

            console.error(
                "Tenant loading failed:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load tenant"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <TenantContext.Provider
            value={{
                tenant,
                loading,
                error,
                reloadTenant: loadTenant
            }}
        >
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);

    if (!context) {
        throw new Error(
            "useTenant must be used inside TenantProvider"
        );
    }

    return context;
};