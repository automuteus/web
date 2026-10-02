import { useTranslation } from "react-i18next";
import AppLayout from "./AppLayout";

const ErrorLayout = () => {
    const { t } = useTranslation("common");
    return (
        <AppLayout>
            <div className="container pb-4 d-flex flex-grow-1 flex-column align-items-center justify-content-center">
                <h2 className="bg-danger p-2">
                    {t("errorLayout.heading")}
                </h2>
                <h6>{t("errorLayout.report")}</h6>
            </div>
        </AppLayout>
    );
};

export default ErrorLayout;
