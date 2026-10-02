import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { Trans, useTranslation } from "react-i18next";
import AppLayout from "../components/layout/AppLayout";

const ErrorPage = () => {
    const { t } = useTranslation("common");
    return (
        <AppLayout title={t("notFound.title")} theatric>
            <div className="d-flex flex-column flex-grow-1 align-items-center justify-content-center">
                <div className="typewriter text-center">
                    <div className="jumbo-text delay-in">404</div>
                    <h1>
                        <Trans t={t} i18nKey="notFound.heading" components={{ br: <br /> }} />
                    </h1>
                    <Link href="/">
                        <button className="btn btn-primary delay-in">
                            <FontAwesomeIcon icon={faArrowLeft} className="me-1" />{" "}
                            {t("notFound.home")}
                        </button>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
};

export default ErrorPage;
