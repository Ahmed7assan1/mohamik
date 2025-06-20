import React, { useEffect, useState } from "react";
import styles from "./LawyerDelegations.module.css";
import LogoSpinner from '../common/LogoSpinner';

const LawyerDelegations = () => {
  const [delegations, setDelegations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDelegations = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://mohamek-legel.runasp.net/api/LawyerDashBoard/get-all-delgation-laywer",
          {
            headers: {
              "accept": "text/plain",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("فشل في جلب البيانات");
        }
        const data = await response.json();
        console.log("delegations data:", data);
        setDelegations(data);
      } catch (err) {
        setError(err.message || "حدث خطأ");
      } finally {
        setLoading(false);
      }
    };

    fetchDelegations();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px' }}>
      <LogoSpinner size={80} />
    </div>
  );
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>تفويضات المحامي</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>اسم المحامي</th>
            <th>اسم العميل</th>
            <th>تاريخ الإلغاء</th>
            <th>رابط الوثيقة</th>
          </tr>
        </thead>
        <tbody>
          {delegations
            .filter(
              (item) =>
                item.revokedAtDateFormatted === "Not cancelled" &&
                item.delegationDocumentPath && item.delegationDocumentPath.trim() !== ""
            )
            .map((item) => (
              <tr key={item.id}>
                <td>{item.lawyerName}</td>
                <td>{item.clientName}</td>
                <td>{item.revokedAtDateFormatted}</td>
                <td>
                  <a href={item.delegationDocumentPath} target="_blank" rel="noopener noreferrer">
                    تحميل الوثيقة
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default LawyerDelegations; 