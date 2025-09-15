import Image from "next/image";
import React from "react";

const Logo = ({ size = 25, src = "/DocuAI.png" }: { src?: string; size?: number }) => {
	return (
		<div style={{ display: "flex", alignItems: "center" }}>
			<Image
				src={src}
				alt="Logo"
				width={size}
				height={size}
				style={{ marginRight: "10px" }}
			/>
		</div>
	);
};

export default Logo;
