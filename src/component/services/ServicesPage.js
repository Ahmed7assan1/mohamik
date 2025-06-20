import React from "react";
import Services from "./Services";
import styles from "./ServicesPage.module.css";
import Hello from "../common/HelloImage";

const servicesData = [
    {
    imageSrc: "/pics/our services/62d92d37d35534489f62dc762a83d879.jpeg",
    title: "استشارات قانونية شخصية",
    description: "القضايا القانونية تتطلب فهماً عميقاً واهتماماً شخصياً. في محاميك، فريقنا من المحامين والخبراء القانونيين متاح لإرشادك خلال رحلتك القانونية. سواء كنت تحتاج إلى استشارة بشأن قضية شخصية، أو نصيحة قانونية حول مستجدات قانونية، أو مساعدة في فهم حقوقك وواجباتك، نحن هنا لنخصص الوقت لفهم احتياجاتك واقتراح الحلول الأنسب لك.",
    },
    {
    imageSrc: "/pics/our services/2.png",
    title: "خدمات قانونية مخصصة لاحتياجاتك",
    description: "في محاميك، نؤمن بأن لكل قضية طابعها الفريد، لذا نوفر لك خدمات قانونية موجهة لتلبية متطلباتك الفردية. من خلال العمل المباشر مع محامينا الخبراء، نساعدك على بناء خطة قانونية متكاملة تناسب وضعك وتحقق أهدافك بفعالية. سواء كانت قضية حساسة، استشارة متخصصة، أو دعم قانوني شامل، نحن هنا لتقديم حلول استثنائية تعكس رؤيتك وتضمن راحتك القانونية.",

    },
    {
    imageSrc: "/pics/our services/3.png",
    title: "اختيار المحامي الأمثل لقضيتك",
    description: "في محاميك، نساعدك على العثور على المحامي المثالي الذي يلبي احتياجاتك القانونية بدقة واحترافية. بناءً على التخصص، الخبرة، وتقييمات العملاء السابقين، يمكنك اتخاذ قرار مدروس لاختيار المحامي الأنسب لقضيتك. سواء كنت تبحث عن استشارة سريعة أو تمثيل قانوني شامل، نحن هنا لضمان أن تجد الدعم القانوني الذي يستحق ثقتك ويحقق أهدافك.",
    },
    {
    imageSrc: "/pics/our services/4.png",
    title: "فعاليات وورش عمل قانونية",
    description: "انضم إلينا في محاميك لحضور فعاليات وورش عمل متخصصة تحتفي بفن القانون والممارسات القانونية. اكتسب رؤى من خبراء القانون، وتعلم أساسيات التعامل مع القضايا المختلفة، واكتشف الفروق الدقيقة بين التخصصات القانونية. هذه الفعاليات مثالية للمحامين الناشئين وأصحاب القضايا على حد سواء، حيث توفر فرصة فريدة لتوسيع معرفتك القانونية وتعزيز فهمك للعالم القانوني"
    },
    {
        imageSrc: "/pics/our services/5.png",
        title: "سهولة التواصل القانوني أينما كنت",
        description: "في محاميك، نسعى لتوفير تجربة تواصل سلسة وآمنة بينك وبين المحامي الذي تختاره. يمكنك التواصل عبر مكالمات هاتفية، مكالمات فيديو، أو محادثات مشفرة تضمن سرية معلوماتك. بالإضافة إلى ذلك، يمكنك بسهولة رفع أي مستندات أو مرفقات تتعلق بقضيتك، مما يجعل عملية المتابعة أكثر كفاءة وراحة. نحن هنا لتسهيل رحلتك القانونية بأمان واحترافية.",
    },
];



function ServicesPage() {
    return (
        
        <div className={styles["services-page"]}>
            <Hello />
            <div className={styles["services-container"]}>
                {servicesData.map((service, index) => (
                    <div className={`${styles["service-section"]} ${index % 2 !== 0 ? styles.reverse : ""}`} key={index}>
                        <div className={styles["service-content"]}>
                            <h2 className={styles["service-title"]}>{service.title}</h2>
                            <p className={styles["service-description"]}>{service.description}</p>
                        </div>
                        <div className={styles["service-image-container"]}>
                            <img src={service.imageSrc} alt={service.title} className={styles["service-image"]} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ServicesPage;