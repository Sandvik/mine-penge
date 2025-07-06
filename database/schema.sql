-- MinePenge Database Schema
-- For MariaDB/MySQL on one.com hosting

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS minepenge_db;
USE minepenge_db;

-- Articles table - main content
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    summary TEXT,
    content LONGTEXT,
    source VARCHAR(200),
    url VARCHAR(1000),
    published_date DATETIME,
    scraped_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    author VARCHAR(200),
    word_count INT,
    complexity_level ENUM('begynder', 'øvet', 'avanceret', 'mellem') DEFAULT 'begynder',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_article_id (article_id),
    INDEX idx_published_date (published_date),
    INDEX idx_source (source),
    INDEX idx_complexity (complexity_level)
);

-- Tags table
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- Article tags relationship (many-to-many)
CREATE TABLE article_tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    tag_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE KEY unique_article_tag (article_id, tag_id),
    INDEX idx_article_id (article_id),
    INDEX idx_tag_id (tag_id)
);

-- Target audiences table
CREATE TABLE target_audiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Article audiences relationship (many-to-many)
CREATE TABLE article_audiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    audience_id INT NOT NULL,
    confidence_score DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (audience_id) REFERENCES target_audiences(id) ON DELETE CASCADE,
    UNIQUE KEY unique_article_audience (article_id, audience_id),
    INDEX idx_article_id (article_id),
    INDEX idx_audience_id (audience_id)
);

-- Blacklisted articles (for curation)
CREATE TABLE blacklisted_articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id VARCHAR(50) NOT NULL,
    reason TEXT,
    blacklisted_by VARCHAR(100) DEFAULT 'admin',
    blacklisted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_article_id (article_id)
);

-- User favorites
CREATE TABLE user_favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_identifier VARCHAR(100) NOT NULL, -- Could be session ID or user ID
    article_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_article (user_identifier, article_id),
    INDEX idx_user_identifier (user_identifier),
    INDEX idx_article_id (article_id)
);

-- Sources table
CREATE TABLE sources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL,
    domain VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_domain (domain)
);

-- Statistics table for caching
CREATE TABLE statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    key_name VARCHAR(100) UNIQUE NOT NULL,
    value_json JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key_name (key_name)
);

-- Insert default data
INSERT INTO target_audiences (name, description) VALUES
('studerende', 'Studerende på videregående uddannelser'),
('børnefamilier', 'Familier med børn'),
('budgetbevidste', 'Personer med beskedne økonomiske forhold'),
('nybegynder_investering', 'Nybegyndere inden for investering'),
('pensionister', 'Pensionerede personer'),
('økonomi_nybegynder', 'Nybegyndere inden for økonomi');

-- Insert common tags
INSERT INTO tags (name, category) VALUES
('opsparing', 'Økonomi'),
('investering', 'Økonomi'),
('budget', 'Økonomi'),
('gæld', 'Økonomi'),
('pension', 'Økonomi'),
('forsikring', 'Økonomi'),
('bolig', 'Økonomi'),
('skatter', 'Økonomi'),
('børn', 'Livsstil'),
('familie', 'Livsstil'),
('studerende', 'Livsstil'),
('begynder', 'Niveau'),
('øvet', 'Niveau'),
('avanceret', 'Niveau'); 