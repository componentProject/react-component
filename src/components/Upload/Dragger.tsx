import { useState } from "react";
import type { FC, DragEvent } from "react";
import type { DraggerProps } from "./types";
import classNames from "classnames";

export const Dragger: FC<DraggerProps> = (props) => {
	const { onFile, children } = props;

	const [dragOver, setDragOver] = useState(false);

	const cs = classNames("upload-dragger", {
		"is-dragover": dragOver,
	});

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault();
		setDragOver(false);
		onFile(e.dataTransfer.files);
	};

	const handleDrag = (e: DragEvent<HTMLElement>, over: boolean) => {
		e.preventDefault();
		setDragOver(over);
	};

	return (
		<div
			className={cs}
			onDragOver={(e) => {
				handleDrag(e, true);
			}}
			onDragLeave={(e) => {
				handleDrag(e, false);
			}}
			onDrop={handleDrop}
		>
			{children}
		</div>
	);
};

export default Dragger;
