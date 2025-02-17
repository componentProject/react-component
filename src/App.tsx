import "./App.css";
import { useRoutes } from "react-router";
import { Suspense } from "react";

import routes from "./router";

import { useTranslation } from "react-i18next";
import "./locales"; // 引入 i18n 配置
function App() {
	const { t, i18n } = useTranslation();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
	};
	const lngs = {
		en: { nativeName: "English" },
		zh: { nativeName: "中文" },
	};
	return (
		<>
			<h1>{t("language")}</h1>
			<header>
				<select onChange={(e) => changeLanguage(e.target.value)}>
					{Object.keys(lngs).map((lng) => (
						<option
							key={lng}
							value={lng}
							label={lngs[lng].nativeName}
							style={{ fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal" }}
						/>
					))}
				</select>
			</header>
			<Suspense fallback={<h1>你好,我在加载中....</h1>}>{useRoutes(routes)}</Suspense>
		</>
	);
}

export default App;
