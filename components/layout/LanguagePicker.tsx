import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { LANGUAGES, languageOf } from "../settings/settings-edit";
import { chooseLanguage } from "./LanguageSync";

/** The header's language menu. Each language is listed in its own name, so a reader can find theirs whatever the
 * page is currently showing. */
export default function LanguagePicker(): React.ReactElement {
    const { t, i18n } = useTranslation("common");
    const current = languageOf(i18n.language.split("-")[0]) ?? LANGUAGES[0];

    return (
        <Dropdown as={Nav.Item} align="end" className="language-picker" onSelect={(code) => code && chooseLanguage(code)}>
            <Dropdown.Toggle as={Nav.Link} title={t("header.language")} aria-label={t("header.language")}>
                <FontAwesomeIcon icon={faLanguage} size="lg" />
                <span className="d-none d-sm-inline-block ms-2" lang={current.code}>{current.native}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="shadow">
                {LANGUAGES.map((language) => (
                    <Dropdown.Item key={language.code} eventKey={language.code} active={language.code === current.code} lang={language.code}>
                        {t("header.languageOption", { flag: language.flag, native: language.native })}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}
