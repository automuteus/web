export interface PremiumItemPerk {
    key: string;
    value: React.ReactElement;
}

export default function PremiumPerk(props: {
    perk: string;
    description: string;
    icon: React.ReactFragment;
}): React.ReactElement {
    const { perk, description, icon } = props;
    return (
        <div className="card text-center premium-perk-card">
            <div className="card-body">
                <div className="card-title">
                    <div className="text-center text-premium">{icon}</div>
                    <h5 className="text-blurple">{perk}</h5>
                </div>
                <div className="card-text">{description}</div>
            </div>
        </div>
    );
}
