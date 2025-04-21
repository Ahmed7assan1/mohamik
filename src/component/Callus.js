import React from "react";
import "./Callus.css"

function Callus (){
    return(
        <div className="callus">
            <div>
                <img  src="/pics/asset.png"  alt=" "/>
            </div>
            <div>
                <div>
                    <h5>اتصل بنا للحصول على المساعدة القانونية </h5>
                    <p>محامون ذوو خبرة مستعدون للقتال من أجل حقوقك</p>
                </div>
                <div>
                    <button className="btn-call">
                        مجالات القانون لدينا
                    </button>
                    <span>
                        نجاحات جديدة &#8598;
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Callus;