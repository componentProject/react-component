import "@/assets/styles/main.css";
import { LanguageProvider } from "@/locales/LanguageContext";

const preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export const decorators = [
	(Story: any) => (
		<LanguageProvider>
			<div
				className="flex-col"
				style={{
					maxHeight: "100%",
					overflow: "hidden",
				}}
			>
				{Story()}
			</div>
		</LanguageProvider>
	),
];

export default preview;
