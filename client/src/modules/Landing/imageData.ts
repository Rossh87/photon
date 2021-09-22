import { ICarouselChild } from './ui/Carousel';

const baseURL = 'https://cdn.lossy.dev/lossy-assets/';

export type TBaseCarouselData = Pick<ICarouselChild, 'url' | 'href'>;

const imageData: TBaseCarouselData[] = [
	{
		url: `${baseURL}bw-1.jpg`,
		href: 'https://pixabay.com/users/nika_akin-13521770/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=5273871',
	},
	{
		url: `${baseURL}bw-2.jpg`,
		href: 'https://pixabay.com/users/nastya_gepp-3773230/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1848960',
	},
	{
		url: `${baseURL}bw-3.jpg`,
		href: 'https://pixabay.com/users/thwangfsdesign-178313/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=279644',
	},
	{
		url: `${baseURL}bw-4.jpg`,
		href: 'https://pixabay.com/users/engin_akyurt-3656355/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4130604',
	},
	{
		url: `${baseURL}bw-5.jpg`,
		href: 'https://pixabay.com/users/sonyahkross-14710134/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4713342',
	},
	{
		url: `${baseURL}bw-6.jpg`,
		href: 'https://pixabay.com/users/lauramr5-15262204/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=5048006',
	},
	{
		url: `${baseURL}bw-7.jpg`,
		href: 'https://pixabay.com/users/moritz320-1260270/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=6526548',
	},
	{
		url: `${baseURL}bw-8.jpg`,
		href: 'https://pixabay.com/users/lmoonlight-236255/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2430869',
	},
	{
		href: 'https://pixabay.com/users/picsbyjameslee-13643653/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=5272833',
		url: `${baseURL}bw-18.jpg`,
	},

	{
		url: `${baseURL}bw-10.png`,
		href: 'https://pixabay.com/users/qimono-1962238/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=1767564',
	},
	{
		url: `${baseURL}bw-11.jpg`,
		href: 'https://pixabay.com/photos/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=690810',
	},
	{
		url: `${baseURL}bw-12.jpg`,
		href: 'https://pixabay.com/users/artisticoperations-4161274/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2862811',
	},

	{
		url: `${baseURL}bw-13.jpg`,
		href: 'https://pixabay.com/users/stocksnap-894430/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2617112',
	},
	{
		url: `${baseURL}bw-14.jpg`,
		href: 'https://pixabay.com/users/nietjuh-2218222/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2940513',
	},
	{
		url: `${baseURL}bw-15.jpg`,
		href: 'https://pixabay.com/users/ivanovgood-1982503/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2983550',
	},
	{
		url: `${baseURL}bw-16.jpg`,
		href: 'https://pixabay.com/users/anthonyarnaud-943147/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=5183469',
	},

	{
		url: `${baseURL}bw-5.jpg`,
		href: 'https://pixabay.com/users/sonyahkross-14710134/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4713342',
	},
	{
		url: `${baseURL}bw-6.jpg`,
		href: 'https://pixabay.com/users/lauramr5-15262204/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=5048006',
	},
	{
		url: `${baseURL}bw-7.jpg`,
		href: 'https://pixabay.com/users/moritz320-1260270/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=6526548',
	},
	{
		url: `${baseURL}bw-8.jpg`,
		href: 'https://pixabay.com/users/lmoonlight-236255/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2430869',
	},
	{
		url: `${baseURL}bw-9.jpg`,
		href: 'https://pixabay.com/users/heather_ann-7818015/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3459575',
	},
	{
		url: `${baseURL}bw-17.jpg`,
		href: 'https://pixabay.com/users/eluela31-4894494/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2369664',
	},
	{
		href: 'https://pixabay.com/users/picsbyjameslee-13643653/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=5272833',
		url: `${baseURL}bw-18.jpg`,
	},
	{
		href: 'https://pixabay.com/users/elg21-3764790/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=6624102',
		url: `${baseURL}bw-19.jpg`,
	},
	{
		href: 'https://pixabay.com/users/mammiya-12752456/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=6607410',
		url: `${baseURL}bw-20.jpg`,
	},
];

export default imageData;
