<template>
	<div id="gitalk-container"></div>
</template>
<script lang="ts" setup>
import "gitalk/dist/gitalk.css";
import Gitalk from "gitalk";
import { onContentUpdated } from "vitepress";

// const { route, go } = useRouter();
function deleteChild(element: HTMLDivElement | Element | null) {
	let child = element?.lastElementChild;
	while (child) {
		element?.removeChild(child);
		child = element?.lastElementChild;
	}
}

onContentUpdated(() => {
	// reset gittalk element for update
	const element = document.querySelector("#gitalk-container");
	if (!element) {
		return;
	}
	deleteChild(element);
	// 需要去这个网站注册 https://github.com/settings/developers
	const gitalk = new Gitalk({
		clientID: "Ov23li69lLAmlZ5EyPso",
		clientSecret: "cf23522cb2a566af1c36e58f43e238a56f737e7d",
		// 仓库名
		repo: "react-component",
		// 所属用户或组织名
		owner: "componentProject",
		admin: ["moluoxixi"],
		id: location.pathname.substring(0, 50), // Ensure uniqueness and length less than 50
		language: "zh-CN",
		distractionFreeMode: true, // Facebook-like distraction free mode
	});
	gitalk.render("gitalk-container");
});
</script>
<style scoped></style>
