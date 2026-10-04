import { useTranslation } from "react-i18next";

export type PerkId = "gameAccess" | "stats" | "support" | "mutingBots";

export interface PremiumItemPerk {
    perk: PerkId;
    value: React.ReactElement;
}

/** Each perk's name and blurb, shared by the perk cards and the tier cards' perk lists. */
export function usePerkText(): Record<PerkId, { title: string; description: string }> {
    const { t } = useTranslation("premium");
    return {
        gameAccess: { title: t("perk.gameAccess.title"), description: t("perk.gameAccess.description") },
        stats: { title: t("perk.stats.title"), description: t("perk.stats.description") },
        support: { title: t("perk.support.title"), description: t("perk.support.description") },
        mutingBots: { title: t("perk.mutingBots.title"), description: t("perk.mutingBots.description") },
    };
}

export default function PremiumPerk(props: {
    perk: PerkId;
    icon: React.ReactNode;
}): React.ReactElement {
    const { perk, icon } = props;
    const { title, description } = usePerkText()[perk];
    return (
        <div className="card text-center premium-perk-card">
            <div className="card-body">
                <div className="card-title">
                    <div className="text-center text-premium">{icon}</div>
                    <h5 className="text-blurple">{title}</h5>
                </div>
                <div className="card-text">{description}</div>
            </div>
        </div>
    );
}
