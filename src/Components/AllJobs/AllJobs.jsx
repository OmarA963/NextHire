import React, { useContext, useState } from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Link } from 'react-router-dom'
import { TheUserContext } from '../UserContext/UserContext'
import "./AllJobs.css"

export default function AllJobs() {
    const { jobs, searchQuery, setSearchQuery } = useContext(TheUserContext)
    const [filterLocation, setFilterLocation] = useState('Any Location')
    const [filterCategory, setFilterCategory] = useState('All Categories')

    // Helper to get initials for avatar
    const getInitials = (title) => {
        return title.split(' ').slice(0, 2).map(word => word[0]).join('').toUpperCase()
    }

    // Helper for avatar color class
    const getAvatarClass = (title) => {
        const t = title.toLowerCase();
        if (t.includes('software') || t.includes('front')) return 'avatar-fd';
        if (t.includes('network')) return 'avatar-ss';
        if (t.includes('manager') || t.includes('product')) return 'avatar-pm';
        return 'avatar-da';
    }

    // Helper for tags
    const getTypeTagClass = (type) => {
        if (type.toLowerCase().includes('contract')) return 'tag-fcddbd'; // orange
        return 'tag-d0f3d8'; // green for full-time
    }
    const getLocationTagClass = (location) => {
        return 'tag-bcdbf7'; // blue
    }

    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;

    const filteredJobs = (jobs || []).filter(job => {
        const matchesSearch = !searchQuery || 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesLocation = filterLocation === 'Any Location' || 
            job.location.toLowerCase().includes(filterLocation.toLowerCase());
            
        const matchesCategory = filterCategory === 'All Categories' || 
            job.title.toLowerCase().includes(filterCategory.toLowerCase());
            
        return matchesSearch && matchesLocation && matchesCategory
    })

    // Pagination Calculations
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    const handleClearAll = () => {
        setFilterLocation('Any Location');
        setFilterCategory('All Categories');
        setSearchQuery("");
        setCurrentPage(1);
    }

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    return (
        <>
            <Header />
            
            <div className="jobs-content-container">
                
                <div className="jobs-listing-header">
                    <h2>Jobs Listing <span>({filteredJobs.length})</span></h2>
                    <p>Explore available positions across {filteredJobs.length} results.</p>
                </div>

                {/* Filters */}
                <div className="filter-bar">
                    <div className="search-input-wrapper">
                        <input 
                            type="text" 
                            placeholder="Search jobs, keywords..." 
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                    </div>

                    <select className="filter-select" value={filterLocation} onChange={(e) => { setFilterLocation(e.target.value); setCurrentPage(1); }}>
                        <option>Any Location</option>
                        <option>San Francisco, CA</option>
                        <option>New York, NY</option>
                        <option>Remote</option>
                    </select>

                    <select className="filter-select" value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}>
                        <option>All Categories</option>
                        <option>Design</option>
                        <option>Development</option>
                        <option>Management</option>
                    </select>

                    <button className="clear-all-btn" onClick={handleClearAll}>
                        Clear All
                    </button>
                </div>

                {/* Job List */}
                <div className="jobs-list">
                    {currentJobs.length > 0 ? (
                        currentJobs.map((job) => (
                            <Link 
                                to={"/jobdetails"} 
                                key={job.jobId} 
                                className="job-link-wrapper"
                                onClick={() => localStorage.setItem("selectedJobId", job.jobId)}
                            >
                                <div className="job-list-item">
                                    <div className="job-details-wrapper">
                                        <div className={`job-avatar ${getAvatarClass(job.title)}`}>
                                            {getInitials(job.title)}
                                        </div>

                                        <div className="job-details">
                                            <h3>{job.title}</h3>
                                            <p className="company-name">{job.company}</p>
                                            <div className="job-meta">
                                                <div className="meta-location">
                                                    <i className="fa-solid fa-location-dot" style={{fontSize: '11px', color: '#6b7280'}}></i>
                                                    {job.location}
                                                </div>
                                                <div className="meta-salary">{job.salaryRange || '$10,000$'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="job-tags-right">
                                        <span className={`tag-pill ${getTypeTagClass(job.type)}`}>
                                            {job.type}
                                        </span>
                                        <span className={`tag-pill ${getLocationTagClass(job.location)}`}>
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="empty-state">
                            <i className="fa-solid fa-magnifying-glass-chart"></i>
                            <h3>No jobs found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>

                {/* Pagination UI */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <span 
                            className={`pagination-nav ${currentPage === 1 ? 'disabled' : ''}`}
                            onClick={() => paginate(currentPage - 1)}
                        >
                            Previous
                        </span>
                        {[...Array(totalPages)].map((_, index) => (
                            <div 
                                key={index + 1}
                                className={`pagination-item ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => paginate(index + 1)}
                            >
                                {index + 1}
                            </div>
                        ))}
                        <span 
                            className={`pagination-nav ${currentPage === totalPages ? 'disabled' : ''}`}
                            onClick={() => paginate(currentPage + 1)}
                        >
                            Next
                        </span>
                    </div>
                )}

            </div>
            
            <Footer />
        </>
    );
}
