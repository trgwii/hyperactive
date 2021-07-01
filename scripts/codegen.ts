type Prop = {
	prop: string;
	desc: string;
	type: string;
};

const getKeyStr = (key: string) => (key.includes("-") ? `["${key}"]` : key);

const docLine = (line: string) => {
	line = line.trim();
	if (!line) return "";
	line = line.replace(
		/<|>/g,
		s => ({ "<": "`<", ">": ">`" }[s as "<" | ">"]),
	);
	if (line.startsWith("Note")) line = "> " + line;
	return " * " + line;
};

const getDesc = (prop: Prop, indent: string) =>
	prop.desc &&
	indent +
		"/**\n" +
		indent +
		prop.desc
			.replace("\n\n", "\n")
			.split("\n")
			.map(docLine)
			.filter(Boolean)
			.join("\n" + indent + " *\n" + indent) +
		("\n" + indent + " */\n");

const transformProp = (indent: string) => (prop: Prop) =>
	getDesc(prop, indent) + `${indent}${getKeyStr(prop.prop)}: ${prop.type};`;

export const propsToType = (
	name: string,
	props: Prop[],
	{ partial, root }: { partial?: boolean; root?: boolean } = {},
) => {
	const indent = "\t".repeat(root ? 1 : 2);
	const op = (partial ? "Partial<" : "") + "{";
	const ed = "}" + (partial ? ">" : "");
	return [
		`${name}${root ? " =" : ":"} ${op}`,
		props.map(transformProp(indent)).join("\n"),
		"\t".repeat(root ? 0 : 1) + ed + ";",
	].join("\n");
};
