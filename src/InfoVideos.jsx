import React from 'react';
import Header from './Header';
import Footer from './Footer';
 
const videos = {
  mythBusting: [
    {
      title: 'TOP 5 NEW Construction MYTHS DEBUNKED',
      url: 'https://www.youtube.com/embed/I0vmCO_860E',
      description: 'This video addresses prevalent misconceptions in new home construction, offering insights into the realities of building practices.'
    },
    {
      title: '7 Major New Construction Myths DEBUNKED',
      url: 'https://www.youtube.com/embed/cU-bQ14gRww',
      description: 'Explore and debunk seven common myths associated with new construction homes, providing clarity for prospective homeowners.'
    },
    {
      title: '4 Myths About Construction Debunked',
      url: 'https://www.youtube.com/embed/22W5tRWbUVI',
      description: 'This video sheds light on misconceptions surrounding construction practices, offering factual information for informed decisions.'
    },
    {
      title: '7 MYTHS YOU\'RE TOLD ABOUT CUSTOM HOMES',
      url: 'https://www.youtube.com/embed/example1',
      description: 'Uncover the truths behind custom home building by debunking seven common myths in this informative video.'
    },
    {
      title: 'Top 5 Myths About Building New Homes in Florida DEBUNKED',
      url: 'https://www.youtube.com/embed/example2',
      description: 'Addressing myths specific to building new homes in Florida, this video offers clarity on common misunderstandings.'
    }
  ],
  educational: [
    {
      title: 'How To Create A Construction Budget',
      url: 'https://www.youtube.com/embed/CAxtpVb376Y',
      description: 'Learn the essentials of setting up a construction budget, emphasizing the importance of financial planning in home building.'
    },
    {
      title: '10 Ways to Control the Budget on Your Custom Home',
      url: 'https://www.youtube.com/embed/hmXkg0RAdCo',
      description: 'Discover ten practical tips to maintain control over your home construction budget, ensuring financial efficiency.'
    },
    {
      title: 'Construction Estimating and Budgeting Basics',
      url: 'https://www.youtube.com/embed/cLBn8876T5s',
      description: 'An in-depth overview that delves into controlling costs and budgeting within construction projects.'
    },
    {
      title: 'Budgeting Mistakes When Building Your Own Home',
      url: 'https://www.youtube.com/embed/example3',
      description: 'This video guides you through common budgeting mistakes and how to avoid them during your home building project.'
    },
    {
      title: 'Best Practices for the Building and Construction Industry',
      url: 'https://www.youtube.com/embed/example4',
      description: 'Explore best practices in the building and construction industry, focusing on managing approvals and budgets effectively.'
    }
  ]
};
 
const InfoVideos = () => {
  return (
<div className="min-h-screen flex flex-col bg-gray-50">
<Header />
<main className="flex-grow container border border-gray-300/50 rounded-md drop-shadow-xs px-3 sm:px-4 py-6 md:py-8 mt-20 md:mt-25 mx-2 sm:mx-4 md:mx-5 mb-6">
        {/* Myth-Busting Videos Section */}
<section className="mb-8 md:mb-12">
<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-yellow-500">
            Myth-Busting Videos on Home Building
</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {videos.mythBusting.map((video, index) => (
<div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
<div className="aspect-w-16 aspect-h-9">
<iframe
                    className="w-full h-40 sm:h-48"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
></iframe>
</div>
<div className="p-3 sm:p-4">
<h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">{video.title}</h3>
<p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{video.description}</p>
<a
                    href={video.url.replace('embed/', 'watch?v=')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-600 hover:text-yellow-700 text-xs sm:text-sm font-medium"
>
                    Watch on YouTube →
</a>
</div>
</div>
            ))}
</div>
</section>
 
        {/* Educational Videos Section */}
<section>
<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 border-b-2 border-yellow-500">
            Educational Videos on Budgeting and Best Practices
</h2>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {videos.educational.map((video, index) => (
<div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
<div className="aspect-w-16 aspect-h-9">
<iframe
                    className="w-full h-40 sm:h-48"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
></iframe>
</div>
<div className="p-3 sm:p-4">
<h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">{video.title}</h3>
<p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{video.description}</p>
<a
                    href={video.url.replace('embed/', 'watch?v=')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-600 hover:text-yellow-700 text-xs sm:text-sm font-medium"
>
                    Watch on YouTube →
</a>
</div>
</div>
            ))}
</div>
</section>
</main>
 
      <Footer />
</div>
  );
};
 
export default InfoVideos;