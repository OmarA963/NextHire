/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, MapPin, ChevronDown } from 'lucide-react';

const jobs = [
  {
    id: 1,
    initials: 'SS',
    avatarBg: 'bg-[#ffc9ae]',
    textColor: 'text-[#4a2e1d]',
    title: 'Senior UI/UX Designer',
    company: 'Innova Solutions',
    location: 'San Francisco, CA',
    salary: '$130k - $150k / year',
    tags: [
      { label: 'Full-Time', bg: 'bg-[#d0f3d8]', text: 'text-[#30683d]' },
      { label: 'Active', bg: 'bg-[#bcdbf7]', text: 'text-[#2b598b]' },
    ],
  },
  {
    id: 2,
    initials: 'FD',
    avatarBg: 'bg-[#b6d6f5]',
    textColor: 'text-[#1e3b5e]',
    title: 'Frontend Developer',
    company: 'Innova Solutions',
    location: 'San Francisco, CA',
    salary: '$130k - $150k / year',
    tags: [
      { label: 'Full-Time', bg: 'bg-[#d0f3d8]', text: 'text-[#30683d]' },
      { label: 'Active', bg: 'bg-[#bcdbf7]', text: 'text-[#2b598b]' },
    ],
  },
  {
    id: 3,
    initials: 'PM',
    avatarBg: 'bg-[#ffc9ae]',
    textColor: 'text-[#4a2e1d]',
    title: 'Product Manager',
    company: 'Innova Solutions',
    location: 'San Francisco, CA',
    salary: '$130k - $150k / year',
    tags: [
      { label: 'Contract', bg: 'bg-[#fcddbd]', text: 'text-[#874922]' },
      { label: 'Remote', bg: 'bg-[#bcdbf7]', text: 'text-[#2b598b]' },
    ],
  },
  {
    id: 4,
    initials: 'DA',
    avatarBg: 'bg-[#b8ebc6]',
    textColor: 'text-[#245230]',
    title: 'Data Analyst',
    company: 'Innova Solutions',
    location: 'San Francisco, CA',
    salary: '$130k - $150k / year',
    tags: [
      { label: 'Full-Time', bg: 'bg-[#d0f3d8]', text: 'text-[#30683d]' },
      { label: 'Open', bg: 'bg-[#bcdbf7]', text: 'text-[#2b598b]' },
    ],
  },
];

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-gradient-to-r from-[#b3d7fb] from-50% to-[#fbcdb1] to-50% font-sans antialiased text-gray-900">
      <div className="max-w-[780px] w-full bg-[#fcf8ef] rounded-[28px] p-6 sm:p-10 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-[500] text-[#1c1c1c] mb-2 tracking-tight">Jobs Listing</h1>
          <p className="text-sm text-gray-600">Explore available positions.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search jobs, keywords..."
              className="w-full h-[42px] pl-4 pr-10 rounded-[12px] outline-none text-[13.5px] text-gray-800 bg-white border border-[#e8e4db] focus:border-gray-400 placeholder:text-gray-400"
            />
             <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Location */}
          <button className="h-[42px] px-4 rounded-[12px] bg-white border border-[#e8e4db] flex items-center gap-2 text-[13.5px] text-[#222] hover:bg-gray-50 transition-colors shrink-0">
            <MapPin className="w-3.5 h-3.5 text-gray-500" strokeWidth={2.5} />
            Any Location
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-3" strokeWidth={2.5}/>
          </button>

          {/* Categories */}
          <button className="h-[42px] px-4 rounded-[12px] bg-white border border-[#e8e4db] flex items-center gap-2 text-[13.5px] text-[#222] hover:bg-gray-50 transition-colors shrink-0">
            All Categories
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-5" strokeWidth={2.5}/>
          </button>

          {/* Filter Btn */}
          <button className="h-[42px] px-5 rounded-[12px] bg-[#f0e9dd] hover:bg-[#e4dccf] text-[#222] text-[13.5px] font-[500] transition-colors shrink-0">
            Filter
          </button>

          {/* Clear All */}
          <button className="h-[42px] px-1 text-gray-500 hover:text-gray-900 text-[13.5px] font-[500] transition-colors shrink-0 ml-1">
            Clear All
          </button>
        </div>

        {/* Job List */}
        <div className="flex flex-col gap-4 mb-8">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-4 sm:p-[18px] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] border border-transparent"
            >
              {/* Avatar */}
              <div
                className={`w-[52px] h-[52px] rounded-full flex items-center justify-center text-[18px] font-medium shrink-0 ${job.avatarBg} ${job.textColor}`}
              >
                {job.initials}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="text-[16px] font-[500] text-gray-900 leading-tight mb-1">
                  {job.title}
                </h2>
                <p className="text-[13px] text-gray-600 mb-1.5">{job.company}</p>
                <div className="flex items-center text-[12.5px] text-gray-500">
                  <div className="flex items-center gap-1.5 border-r border-[#e5e5e5] pr-3">
                    <MapPin className="w-3.5 h-3.5" strokeWidth={2.5}/>
                    {job.location}
                  </div>
                  <div className="pl-3">{job.salary}</div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-[6px] shrink-0 self-start sm:self-center mt-2 sm:mt-0">
                {job.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-[500] ${tag.bg} ${tag.text}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-[6px] text-[13.5px] text-gray-700 font-[400] pt-2">
          <button className="px-2 py-1.5 hover:text-gray-900 text-gray-400 mr-2">Previous</button>
          
          <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#eae3d4] text-[#222]">1</button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#eae3d4]/50 transition-colors">2</button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#eae3d4]/50 transition-colors">3</button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#eae3d4]/50 transition-colors">4</button>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#eae3d4]/50 transition-colors">5</button>
          
          <span className="px-1 text-gray-700">...</span>
          
          <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#eae3d4]/50 transition-colors">12</button>
          
          <button className="px-2 py-1.5 hover:text-gray-900 text-[#222] ml-2">Next</button>
        </div>

      </div>
    </div>
  );
}
