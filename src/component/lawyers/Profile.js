import React, { useState } from "react";

function Profile() {
  const [activeTab, setActiveTab] = useState("description"); // الحالة الافتراضية

  return (
    <div className="profile-tabs">
      {/* أزرار التبويب */}
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
          onClick={() => setActiveTab("description")}
        >
          الوصف
        </button>
        <button
          className={`tab-btn ${activeTab === "comments" ? "active" : ""}`}
          onClick={() => setActiveTab("comments")}
        >
          التعليقات
        </button>
      </div>

      {/* محتوى التبويب النشط */}
      <div className="tabs-content">
        {activeTab === "description" ? (
          <div className="content1">
            <h3>السيرة الذاتية</h3>
            <p>
              عندما تتعرض للأذى في حادث سيارة، أو على يد متخصص طبي مهمل، أو على
              ممتلكات طرف آخر، فهناك عدد من المسارات التي يمكنك اتباعها. ومع
              ذلك، ليست كل المسارات متاحة لكل فرد. لهذا السبب من المهم إجراء
              بحثك عند التفكير في محاميي الإصابات الشخصية بعد وقوع حادث في
              شيكاغو. منذ عام 2013، كنت أمثل بعطف وعدوانية العملاء الذين لديهم
              خيارات محدودة بعد حادث سيارة أو حادث شاحنة أو إصابة في مكان العمل
              أو أي قضية قانونية أخرى ذات صلة. أنا مكرس لتزويد العملاء بالمعلومات
              التي يحتاجون إليها لاتخاذ خيارات مستنيرة فيما يتعلق بقضيتهم، وأنا
              أكافح بحماس لضمان عدم استغلال الأفراد الذين أمثلهم من قبل شركات
              التأمين والأطراف الأخرى المهتمة فقط بحماية صافي أرباحهم.
            </p>
          </div>
        ) : (
          <div className="content2">
            <div>
              <h3>التعليق الأول</h3>
              <span>شخص كويس</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;