# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# مشروع محاميك القانوني

## الميزات الجديدة في صفحة الملف الشخصي للعميل

### عرض الحجوزات
تم إضافة قسم جديد في صفحة الملف الشخصي للعميل يعرض جميع الحجوزات الخاصة به مع الميزات التالية:

#### الميزات المضافة:
1. **عرض الحجوزات الحالية**: يعرض جميع الحجوزات غير المكتملة للعميل
2. **عرض الحجوزات المكتملة**: إمكانية التبديل بين عرض الحجوزات الحالية والمكتملة
3. **تحديث الحجوزات**: زر لتحديث قائمة الحجوزات من الخادم
4. **تنسيق جميل**: تصميم متجاوب ومتطور مع ألوان مميزة للحالات المختلفة

#### معلومات الحجز المعروضة:
- اسم المحامي
- تاريخ ووقت الاستشارة
- حالة الحجز (محجوز، مكتمل، ملغي)
- ملاحظات إضافية (إن وجدت)

#### التصميم:
- تصميم متجاوب يعمل على جميع أحجام الشاشات
- ألوان مميزة لحالات الحجز المختلفة:
  - أزرق للحجوزات المحجوزة
  - أخضر للحجوزات المكتملة
  - أحمر للحجوزات الملغية
- تأثيرات بصرية عند التمرير فوق العناصر
- تخطيط منظم وسهل القراءة

#### التقنيات المستخدمة:
- React Hooks (useState, useEffect)
- Axios للاتصال بالخادم
- CSS Modules للتنسيق
- API Integration مع الخادم

### كيفية الاستخدام:
1. تسجيل الدخول كعميل
2. الانتقال إلى صفحة الملف الشخصي
3. التمرير لأسفل لرؤية قسم "حجوزاتي"
4. استخدام الأزرار للتبديل بين أنواع الحجوزات وتحديث القائمة
