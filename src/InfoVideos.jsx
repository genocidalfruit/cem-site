import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Play, ExternalLink, ChevronRight } from 'lucide-react';

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

const VideoCard = ({ video, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video thumbnail container with overlay */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <iframe
          className="w-full h-48 sm:h-52 transition-transform duration-300 group-hover:scale-105"
          src={video.url}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className={`${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-0'} transition-all duration-300`}>
            <div className="bg-yellow-500 rounded-full p-3 shadow-lg">
              <Play className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
        </div>

        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-200">
          {video.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {video.description}
        </p>

        {/* Action button */}
        <div className="pt-2">
          <a
            href={video.url.replace('embed/', 'watch?v=')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold text-sm group/link transition-all duration-200"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Watch on YouTube</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Subtle border animation */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-gray-200 group-hover:ring-yellow-400/50 transition-all duration-300" />
    </div>
  );
};

const SectionHeader = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <div className="inline-flex items-center justify-center w-16 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mb-6" />
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      {title}
    </h2>
    {subtitle && (
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

const InfoVideos = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100/50 py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Expert Construction Videos
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Learn from industry professionals with our curated collection of myth-busting and educational content
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 space-y-20">
          {/* Myth-Busting Videos Section */}
          <section>
            <SectionHeader 
              title="Myth-Busting Videos"
              subtitle="Separating fact from fiction in home construction with expert insights"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {videos.mythBusting.map((video, index) => (
                <VideoCard key={index} video={video} index={index} />
              ))}
            </div>
          </section>

          {/* Educational Videos Section */}
          <section>
            <SectionHeader 
              title="Educational Resources"
              subtitle="Master budgeting and best practices with comprehensive guides"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {videos.educational.map((video, index) => (
                <VideoCard key={index} video={video} index={index} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InfoVideos;