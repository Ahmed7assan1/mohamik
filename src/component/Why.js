import React from "react";



function Why(){
    const cardsData = [
        {
            title: "أفضل المحامين",
            description: "خبرة من المحامين المتخصصين في مختلف التخصصات القانونية."
        },
        {
            title: "إدارة القضايا بفاعلية",
            description: "مراجعة دقيقة للقضايا مع تقارير واضحة للعملاء."
        },
        {
            title: "أسعار تنافسية وآمنة",
            description: "نظام دفع آمن يضمن حقوق العميل والمحامي."
        },
        {
            title: "سهولة التواصل",
            description: "إمكانية التواصل مع المحامين عن بعد."
        }
    ];


    return(
        <div>
            <div>
                <h3>لماذا تختار 
                منصه محاميك</h3>
                <p> "لأن منصة محاميك تجمع بين الخبرة القانونية، السهولة في الاستخدام، والأمان لضمان أفضل تجربة لعملائنا."
                </p>
                <button>تواصل معنا</button>
            </div>

            <div className="card-box">
                <div className="card-box">
                    {cardsData.map((card, index) => (
                        <div className="feature-card" key={index}>
                            <h2>{card.title}</h2>
                            <p>{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Why ;