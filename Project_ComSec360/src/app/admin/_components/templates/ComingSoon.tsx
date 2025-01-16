import Image from "next/image";
import React from "react";

const ComingSoon = () => {
	return (
		<section className="container flex justify-center items-center py-20">
			<figure>
				<Image
					src="/illustrations/ComingSoon.png"
					width={1000}
					height={1000}
					className="size-full"
					alt="coming-soon"
					loading="eager"
					priority
				/>
			</figure>
		</section>
	);
};

export default ComingSoon;
