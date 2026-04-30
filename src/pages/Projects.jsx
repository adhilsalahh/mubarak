import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const projectVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  return (
    <div className="projects-page">
      <Header />
      <main>
        <motion.section
          className="projects-hero"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <h1>Our Projects</h1>
          <p>Showcasing our craftsmanship and design excellence</p>
        </motion.section>

        <section className="projects-grid">
          {loading ? (
            <div className="loading">Loading projects...</div>
          ) : (
            <motion.div
              className="projects-container"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {projects.map((project, index) => {
                const images = project.images ? JSON.parse(project.images) : [];
                return (
                  <motion.div
                    key={project.id}
                    className="project-card"
                    variants={projectVariants}
                    whileHover={{
                      scale: 1.03,
                      rotateY: 5,
                      z: 50
                    }}
                    style={{
                      perspective: '1000px'
                    }}
                  >
                    <div className="project-image">
                      {images.length > 0 ? (
                        <img
                          src={`http://localhost:5000/uploads/${images[0]}`}
                          alt={project.title}
                        />
                      ) : (
                        <div className="placeholder-image">Project Image</div>
                      )}
                      <div className="project-overlay">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                      </div>
                    </div>
                    <div className="project-info">
                      <div className="project-meta">
                        <span className="client">Client: {project.client_name}</span>
                        <span className="date">
                          Completed: {new Date(project.completion_date).toLocaleDateString()}
                        </span>
                      </div>
                      <motion.button
                        className="view-project-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          // Could open a detailed project modal or page
                          alert(`View details for ${project.title}`);
                        }}
                      >
                        View Project
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Projects;