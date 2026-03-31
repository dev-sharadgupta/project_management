-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 31, 2026 at 03:02 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `mm_priority_target`
--

CREATE TABLE `mm_priority_target` (
  `id` int(11) NOT NULL,
  `priority_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mm_priority_target`
--

INSERT INTO `mm_priority_target` (`id`, `priority_name`) VALUES
(1, 'Low'),
(2, 'Medium'),
(3, 'High');

-- --------------------------------------------------------

--
-- Table structure for table `mm_priority_task`
--

CREATE TABLE `mm_priority_task` (
  `id` int(11) NOT NULL,
  `priority_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mm_priority_task`
--

INSERT INTO `mm_priority_task` (`id`, `priority_name`) VALUES
(1, 'Low'),
(2, 'Medium'),
(3, 'High');

-- --------------------------------------------------------

--
-- Table structure for table `mm_status_project`
--

CREATE TABLE `mm_status_project` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mm_status_project`
--

INSERT INTO `mm_status_project` (`status_id`, `status_name`) VALUES
(3, 'Complete'),
(2, 'In Progress'),
(1, 'Yet to Start');

-- --------------------------------------------------------

--
-- Table structure for table `mm_status_target`
--

CREATE TABLE `mm_status_target` (
  `id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mm_status_target`
--

INSERT INTO `mm_status_target` (`id`, `status_name`) VALUES
(1, 'Yet to Start'),
(2, 'In Progress'),
(3, 'Complete');

-- --------------------------------------------------------

--
-- Table structure for table `mm_status_task`
--

CREATE TABLE `mm_status_task` (
  `id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mm_status_task`
--

INSERT INTO `mm_status_task` (`id`, `status_name`) VALUES
(1, 'Yet to Start'),
(2, 'In Progress'),
(3, 'Complete');

-- --------------------------------------------------------

--
-- Table structure for table `mm_tags_note`
--

CREATE TABLE `mm_tags_note` (
  `id` int(11) NOT NULL,
  `tag_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mm_tags_note`
--

INSERT INTO `mm_tags_note` (`id`, `tag_name`) VALUES
(1, 'Urgent'),
(2, 'FYI'),
(3, 'Meeting'),
(4, 'Research'),
(5, 'Sales'),
(6, 'Target'),
(7, 'Task'),
(8, 'Development'),
(9, 'Personal'),
(10, 'Documentation');

-- --------------------------------------------------------

--
-- Table structure for table `note_tags`
--

CREATE TABLE `note_tags` (
  `id` int(11) NOT NULL,
  `note_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `note_tags`
--

INSERT INTO `note_tags` (`id`, `note_id`, `tag_id`, `status`) VALUES
(1, 6, 6, 1),
(2, 7, 6, 1),
(3, 8, 7, 1),
(4, 9, 2, 1),
(5, 11, 5, 1),
(6, 11, 6, 1),
(7, 11, 7, 1),
(8, 13, 4, 1),
(9, 13, 5, 1),
(10, 15, 4, 1),
(11, 15, 5, 1),
(12, 16, 5, 1),
(13, 16, 4, 1),
(14, 17, 3, 1),
(15, 17, 4, 1),
(16, 18, 5, 1),
(17, 18, 4, 1),
(18, 19, 3, 1),
(19, 19, 4, 1),
(20, 19, 5, 1),
(21, 20, 3, 1),
(22, 20, 4, 1),
(23, 21, 4, 1),
(24, 22, 3, 1),
(25, 22, 4, 1),
(26, 22, 5, 1),
(27, 22, 6, 1),
(28, 22, 7, 1),
(29, 23, 2, 1),
(30, 23, 3, 1),
(31, 24, 3, 1),
(32, 24, 4, 1),
(33, 25, 3, 1),
(34, 25, 4, 1),
(35, 26, 3, 1),
(36, 27, 3, 1),
(37, 28, 4, 1),
(38, 29, 6, 1),
(39, 30, 4, 1),
(40, 30, 5, 1),
(41, 31, 4, 1),
(42, 32, 5, 1),
(43, 32, 4, 1),
(44, 34, 3, 1),
(45, 34, 2, 1),
(46, 35, 4, 1),
(47, 36, 3, 1),
(48, 37, 6, 1),
(49, 37, 5, 1),
(50, 38, 1, 1),
(51, 38, 2, 1),
(52, 38, 6, 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_master`
--

CREATE TABLE `project_master` (
  `id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `summary` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `owner_id` int(11) NOT NULL,
  `project_status` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created` datetime DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `modified` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modified_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_master`
--

INSERT INTO `project_master` (`id`, `title`, `summary`, `description`, `start_date`, `end_date`, `owner_id`, `project_status`, `status`, `created`, `created_by`, `modified`, `modified_by`) VALUES
(1, 'Project Alpha', 'Alpha summary', 'Detailed description of Project Alpha', '2025-06-01', '2025-12-31', 1, 1, 1, '2025-06-03 15:58:50', 1, '2025-06-03 15:58:50', 1),
(2, 'Project Beta', 'Beta summary', 'Detailed description of Project Beta', '2025-05-15', '2025-11-30', 2, 2, 1, '2025-06-03 15:58:50', 2, '2025-06-03 15:58:50', 2),
(3, 'Project Gamma', 'Gamma summary', 'Detailed description of Project Gamma', '2025-04-01', '2025-10-15', 3, 3, 1, '2025-06-03 15:58:50', 1, '2025-06-03 15:58:50', 1),
(10, 'Project Theta', 'Summary Project Theta', 'Details description of Project Theta', '2025-06-02', '2026-01-31', 9, 1, 1, '2025-06-24 15:15:43', 1, '2025-06-24 15:15:43', 1),
(12, 'Project Delta', 'Summary of Project Delta', 'Detailed description of Project Delta', '2025-06-01', '2025-12-31', 10, 1, 1, '2025-06-25 10:31:27', 1, '2025-06-25 10:31:27', 1),
(13, 'Project App', 'Project App Summary', 'Project App Description', '2026-01-01', '2026-03-31', 9, 1, 1, '2026-03-31 17:39:46', 1, '2026-03-31 17:39:46', 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `project_members` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_members`
--

INSERT INTO `project_members` (`id`, `project_id`, `user_id`, `status`) VALUES
(78, 1, 2, 1),
(79, 1, 3, 1),
(80, 1, 10, 1),
(81, 10, 2, 1),
(82, 10, 3, 1),
(83, 1, 9, 1),
(87, 3, 2, 1),
(88, 3, 1, 1),
(89, 3, 4, 1),
(92, 10, 8, 1),
(93, 10, 10, 1),
(95, 3, 6, 1),
(147, 2, 1, 1),
(148, 2, 3, 1),
(149, 2, 4, 1),
(150, 2, 5, 1),
(151, 2, 9, 1),
(152, 2, 8, 1),
(153, 2, 7, 1),
(154, 2, 10, 1),
(155, 12, 7, 1),
(156, 12, 8, 1),
(157, 12, 9, 1),
(158, 13, 10, 1),
(159, 13, 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_notes`
--

CREATE TABLE `project_notes` (
  `id` int(11) NOT NULL,
  `project_id` int(11) DEFAULT NULL,
  `target_id` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL,
  `note_type` enum('General','Target','Task') NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `modified` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modified_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_notes`
--

INSERT INTO `project_notes` (`id`, `project_id`, `target_id`, `task_id`, `note_type`, `title`, `content`, `parent_id`, `status`, `created`, `created_by`, `modified`, `modified_by`) VALUES
(7, 2, 6, NULL, 'Target', 'Target Note', 'This is Target Note', NULL, 1, '2025-07-17 12:18:37', 1, '2025-07-18 10:40:10', 1),
(8, 2, NULL, 3, 'Task', 'test', '<p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Lorem ipsum dolor sit amet</strong></p><p><em style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">consectetuer adipiscing elit. Aenean commodo ligula</em><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\"> eget dolor. </span></p><p><u style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </u></p><p><br></p><ol><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Donec quam felis, ultricies nec, pellentesque eu, pretium quis,</span></li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\"> sem. Nulla consequat massa quis enim. Donec pede justo, </span></li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. </span></li></ol><p><br></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. </span></p>', NULL, 1, '2025-07-17 18:38:09', 1, '2025-07-18 13:38:10', 1),
(9, 2, NULL, NULL, 'General', 'test general', 'test general', NULL, 1, '2025-07-17 18:46:11', 1, '2025-07-18 10:40:17', 1),
(10, 2, 6, NULL, 'Target', 'branding', 'branding', NULL, 1, '2025-07-17 18:46:38', 1, '2025-07-18 10:40:18', 1),
(11, 2, 6, NULL, 'Target', 'logo', 'logo', NULL, 1, '2025-07-18 11:00:04', 1, '2025-07-18 11:00:04', 1),
(12, 2, NULL, NULL, 'General', 'General', 'General Task', NULL, 1, '2025-07-18 12:47:16', 1, '2025-07-18 12:47:16', 1),
(13, 2, NULL, NULL, 'General', 'test', '<p><strong>test<span class=\"ql-cursor\">﻿</span></strong></p>', NULL, 1, '2025-07-18 13:07:40', 1, '2025-07-18 13:07:40', 1),
(14, 2, NULL, NULL, 'General', 'This is use for large data', '<p><strong style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Lorem ipsum dolor sit amet</strong></p><p><em style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">consectetuer adipiscing elit. Aenean commodo ligula</em><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\"> eget dolor. </span></p><p><u style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. </u></p><p><br></p><ol><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Donec quam felis, ultricies nec, pellentesque eu, pretium quis,</span></li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\"> sem. Nulla consequat massa quis enim. Donec pede justo, </span></li><li data-list=\"ordered\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. </span></li></ol><p><br></p><p><span style=\"background-color: rgb(255, 255, 255); color: rgb(102, 102, 102);\">Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque</span></p>', NULL, 1, '2025-07-18 13:15:03', 1, '2025-07-18 13:15:03', 1),
(15, 2, 73, NULL, 'Target', 'header', '<p>header</p>', NULL, 1, '2025-07-18 13:51:41', 1, '2025-07-18 13:51:41', 1),
(16, 2, NULL, NULL, 'General', 'TARGET DEMO', '<p>TARGET DEMO</p>', NULL, 1, '2025-07-18 13:59:27', 1, '2025-07-18 13:59:27', 1),
(17, 2, NULL, NULL, 'General', 'yyy', '<p>ttt</p>', NULL, 1, '2025-07-18 16:16:30', 1, '2025-07-18 16:16:30', 1),
(18, 2, NULL, NULL, 'General', 'eeee', '<p>eee</p>', NULL, 1, '2025-07-18 16:17:58', 1, '2025-07-18 16:17:58', 1),
(19, 2, NULL, 7, 'Task', 'test', '<p>test</p>', NULL, 1, '2025-07-18 16:26:07', 1, '2025-07-18 16:26:07', 1),
(20, 2, NULL, 4, 'Task', 'uuuuuuuuuuu', '<p>uuuuuuuuuuu</p>', NULL, 1, '2025-07-18 16:26:35', 1, '2025-07-18 16:26:35', 1),
(21, 2, NULL, 3, 'Task', 'fdsfd', '<p>dsfd</p>', NULL, 1, '2025-07-18 16:29:31', 1, '2025-07-18 16:29:31', 1),
(22, 2, 9, NULL, 'Target', 'Many More Module', '<h1><em>this is for testing purpose</em></h1>', NULL, 1, '2025-07-21 15:24:47', 1, '2025-07-21 15:24:47', 1),
(23, 2, NULL, NULL, 'General', 'yyyy', '<p>yyy</p>', NULL, 1, '2025-07-21 15:25:19', 1, '2025-07-21 15:25:19', 1),
(24, 2, NULL, NULL, 'General', 'ttt', '<p>ttt</p>', NULL, 1, '2025-07-21 15:25:33', 1, '2025-07-21 15:25:33', 1),
(25, 2, NULL, NULL, 'General', 'ss', '<p>ss</p>', NULL, 1, '2025-07-21 15:26:16', 1, '2025-07-21 15:26:16', 1),
(26, 2, NULL, NULL, 'General', 'yurtr', '<p>yrtr</p>', NULL, 1, '2025-07-21 15:27:41', 1, '2025-07-21 15:27:41', 1),
(27, 2, NULL, NULL, 'General', 'gsdg', '<p>fdgf</p>', NULL, 1, '2025-07-21 15:28:23', 1, '2025-07-21 15:28:23', 1),
(28, 2, NULL, NULL, 'General', 'rwet', '<p>sfdg</p>', NULL, 1, '2025-07-21 15:28:49', 1, '2025-07-21 15:28:49', 1),
(29, 2, NULL, NULL, 'General', 'gsdgs', '<p>gsdg</p>', NULL, 1, '2025-07-21 15:29:02', 1, '2025-07-21 15:29:02', 1),
(30, 2, NULL, NULL, 'General', 'dffd', '<p>ffdf</p>', NULL, 1, '2025-07-21 15:36:02', 1, '2025-07-21 15:36:02', 1),
(31, 2, NULL, NULL, 'General', 'fdsf', '<p>fdsf</p>', NULL, 1, '2025-07-21 15:39:42', 1, '2025-07-21 15:39:42', 1),
(32, 2, NULL, NULL, 'General', 'fdg', '<p>gfdgf</p>', NULL, 1, '2025-07-21 15:41:53', 1, '2025-07-21 15:41:53', 1),
(33, 2, NULL, NULL, 'General', 'fdsf', '<p>dsf</p>', NULL, 1, '2025-07-21 15:47:23', 1, '2025-07-21 15:47:23', 1),
(34, 2, NULL, NULL, 'General', 'ababab', '<p>fdfd</p>', NULL, 1, '2025-07-21 15:47:49', 1, '2025-07-21 15:47:49', 1),
(35, 2, 7, NULL, 'Target', 'test sales', '<p>test sales</p>', NULL, 1, '2025-07-21 15:50:23', 1, '2025-07-21 15:50:23', 1),
(36, 2, NULL, 9, 'Task', 'HEAD..', '<p>HEAD</p>', NULL, 1, '2025-07-21 17:27:47', 1, '2025-07-21 17:27:47', 1),
(37, 2, 7, NULL, 'Target', 'Sales report 1', '<p>Sales</p>', NULL, 1, '2025-07-21 17:39:51', 1, '2025-07-21 17:39:51', 1),
(38, 13, NULL, NULL, 'General', 'Note 1', '<p><strong>Note 1 Description</strong></p>', NULL, 1, '2026-03-31 17:44:40', 1, '2026-03-31 17:44:40', 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_targets`
--

CREATE TABLE `project_targets` (
  `id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `owner_id` int(11) NOT NULL,
  `priority` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `modified` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modified_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_targets`
--

INSERT INTO `project_targets` (`id`, `project_id`, `title`, `description`, `start_date`, `due_date`, `owner_id`, `priority`, `status`, `created`, `created_by`, `modified`, `modified_by`) VALUES
(6, 2, 'Branding Logo', 'First, a disclaimer – the entire process writing a blog post often takes a couple of hours if you can type', '2025-06-01', '2025-06-30', 2, 1, 1, '2025-06-27 13:13:15', 1, '2025-06-27 13:13:15', 1),
(7, 2, 'Sales report page', 'First, a disclaimer takes a couple hours', '2025-07-01', '2025-08-23', 3, 2, 1, '2025-06-27 13:50:01', 1, '2025-07-01 15:52:49', 1),
(9, 2, 'To check User Management', 'First, a disclaimer takes a couple hours', '2025-07-02', '2025-08-31', 1, 1, 2, '2025-06-27 13:54:33', 1, '2025-07-03 17:35:32', 1),
(11, 2, 'Design main Dashboard', 'First, a disclaimer – the entire process writing a blog post often takes a couple of hours if you can type', '2025-06-17', '2025-06-30', 2, 3, 3, '2025-06-27 16:04:53', 1, '2025-06-27 16:04:53', 1),
(73, 2, 'Create Header', 'Description of Creating header.', '2025-07-02', '2025-07-29', 3, 1, 3, '2025-07-01 15:27:52', 1, '2025-07-03 15:13:36', 1),
(83, 13, 'Milestone 1st', 'This is the First Milestone', '2026-03-10', '2026-03-18', 9, 2, 1, '2026-03-31 17:41:23', 1, '2026-03-31 17:41:40', 1);

-- --------------------------------------------------------

--
-- Table structure for table `project_tasks`
--

CREATE TABLE `project_tasks` (
  `id` int(11) NOT NULL,
  `target_id` int(11) DEFAULT NULL,
  `project_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `start_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `priority` int(11) NOT NULL,
  `created` datetime DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `modified` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modified_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_tasks`
--

INSERT INTO `project_tasks` (`id`, `target_id`, `project_id`, `title`, `description`, `status`, `start_date`, `due_date`, `priority`, `created`, `created_by`, `modified`, `modified_by`) VALUES
(1, 6, 2, 'Make Logo Effect', 'Logo should with effect', 1, '2025-07-08', '2025-07-11', 1, '2025-07-10 13:02:51', 1, '2025-07-10 13:02:51', 1),
(3, NULL, 2, 'Make Custom Sheet', 'Make Custom Sheet for the report', 2, '2025-07-01', '2025-07-22', 2, '2025-07-10 16:37:55', 1, '2025-07-10 16:37:55', 1),
(4, 6, 2, 'changes in logo', 'changes in logo', 1, '2025-07-08', '2025-07-29', 2, '2025-07-10 18:15:57', 1, '2025-07-10 18:15:57', 1),
(5, 11, 2, 'Dashboard side layout', 'make the dashboard side layout and make it scrollable.', 3, '2025-07-01', '2025-07-14', 3, '2025-07-10 18:43:45', 1, '2025-07-10 18:45:15', 1),
(6, 11, 2, 'Test', 'test', 1, '2025-07-25', '2025-07-29', 2, '2025-07-10 18:49:56', 1, '2025-07-10 18:49:56', 1),
(7, NULL, 2, 'test 2', 'test 2', 1, '2025-07-14', '2025-07-29', 2, '2025-07-14 10:26:45', 1, '2025-07-14 10:26:45', 1),
(8, NULL, 2, 'Test 3', 'Test 3', 3, '2025-07-01', '2025-07-29', 3, '2025-07-14 10:39:30', 1, '2025-07-14 10:39:30', 1),
(9, 73, 2, 'Create Header Nav Bar', 'Create Header Nav Bar', 2, '2025-07-22', '2025-07-30', 2, '2025-07-14 10:40:16', 1, '2025-07-14 10:40:16', 1),
(10, 7, 2, 'make report', 'make report', 1, '2025-07-08', '2025-07-30', 2, '2025-07-14 16:39:53', 1, '2025-07-14 16:39:53', 1),
(11, 9, 2, 'Check User management report', 'Check User management report', 2, '2025-07-22', '2025-07-28', 2, '2025-07-14 16:52:16', 1, '2025-07-14 16:52:16', 1),
(12, NULL, 2, 'Dummy Task', 'Dummy Task', 1, '2025-07-23', '2025-07-31', 2, '2025-07-22 15:09:42', 1, '2025-07-22 15:09:42', 1),
(13, 7, 2, 'Sales Report Dummy', 'Sales Report Dummy', 1, '2025-07-23', '2025-07-31', 3, '2025-07-22 15:16:03', 1, '2025-07-22 15:16:03', 1),
(14, 73, 2, 'Header Demo', 'Header Demo', 1, '2025-07-23', '2025-08-01', 1, '2025-07-22 15:22:56', 1, '2025-07-22 15:22:56', 1),
(15, 6, 2, 'Logo Dummy', 'Logo Dummy', 1, '2025-07-23', '2025-08-02', 3, '2025-07-22 15:53:11', 1, '2025-07-22 15:53:11', 1),
(16, 83, 13, 'Task 1', 'Task 1 Description', 3, '2026-03-03', '2026-03-11', 2, '2026-03-31 17:42:22', 1, '2026-03-31 17:42:22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `target_members`
--

CREATE TABLE `target_members` (
  `id` int(11) NOT NULL,
  `target_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `target_members`
--

INSERT INTO `target_members` (`id`, `target_id`, `user_id`, `status`) VALUES
(1, 6, 1, 1),
(2, 7, 1, 1),
(3, 7, 3, 1),
(4, 8, 3, 1),
(6, 10, 1, 1),
(7, 10, 3, 1),
(8, 11, 1, 1),
(9, 11, 3, 1),
(10, 12, 1, 1),
(11, 13, 3, 1),
(12, 13, 1, 1),
(13, 15, 1, 1),
(14, 16, 3, 1),
(15, 17, 1, 1),
(16, 18, 1, 1),
(17, 19, 1, 1),
(18, 21, 1, 1),
(19, 23, 3, 1),
(20, 26, 1, 1),
(21, 27, 3, 1),
(22, 30, 3, 1),
(23, 34, 3, 1),
(24, 43, 3, 1),
(25, 43, 1, 1),
(26, 44, 1, 1),
(27, 44, 3, 1),
(28, 45, 1, 1),
(29, 47, 1, 1),
(30, 47, 3, 1),
(31, 51, 3, 1),
(32, 52, 1, 1),
(33, 52, 3, 1),
(34, 72, 2, 1),
(37, 76, 2, 1),
(38, 76, 3, 1),
(39, 79, 1, 1),
(40, 79, 2, 1),
(41, 80, 1, 1),
(42, 81, 1, 1),
(43, 81, 2, 1),
(46, 73, 2, 1),
(49, 9, 3, 1),
(50, 82, 1, 1),
(51, 82, 2, 1),
(53, 83, 8, 1);

-- --------------------------------------------------------

--
-- Table structure for table `task_members`
--

CREATE TABLE `task_members` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `task_members`
--

INSERT INTO `task_members` (`id`, `task_id`, `user_id`, `status`) VALUES
(1, 1, 3, 1),
(2, 1, 1, 1),
(9, 5, 2, 1),
(10, 6, 3, 1),
(11, 6, 2, 1),
(12, 6, 1, 1),
(13, 8, 2, 1),
(14, 8, 3, 1),
(15, 9, 3, 1),
(16, 10, 4, 1),
(17, 10, 3, 1),
(18, 10, 2, 1),
(19, 12, 4, 1),
(20, 12, 5, 1),
(21, 13, 5, 1),
(22, 13, 3, 1),
(23, 14, 4, 1),
(24, 14, 5, 1),
(25, 15, 3, 1),
(26, 15, 2, 1),
(27, 16, 9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE `user_master` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `image` varchar(100) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `created` datetime DEFAULT current_timestamp(),
  `created_by` int(11) NOT NULL,
  `modified` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `modified_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_master`
--

INSERT INTO `user_master` (`id`, `full_name`, `email`, `password`, `role`, `image`, `status`, `created`, `created_by`, `modified`, `modified_by`) VALUES
(1, 'Sharad Gupta', 'sharad@example.com', 'hashed_password_123', 'Admin', 'https://i.pravatar.cc/150?u=max', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:48:02', 0),
(2, 'Neha Sharma', 'neha.sharma@example.com', 'hashed_password_456', 'Manager', 'https://i.pravatar.cc/150?u=emma', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:47:36', 0),
(3, 'Ravi Kumar', 'ravi.kumar@example.com', 'hashed_password_789', 'Developer', 'https://i.pravatar.cc/150?u=sean', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:48:36', 0),
(4, 'Aisha Khan', 'aisha.k@example.com', 'hashed_password_abc', 'QA', 'https://i.pravatar.cc/150?u=emma', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:48:56', 0),
(5, 'Arjun Mehta', 'arjun.m@example.com', 'hashed_password_xyz', 'Developer', 'https://i.pravatar.cc/150?u=max', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:48:08', 0),
(6, 'Shobhit Garg', 'shobhit@example.com', 'hashed_password_123', 'Admin', 'https://i.pravatar.cc/150?u=brian', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:48:48', 0),
(7, 'Akash Sharma', 'akash.sharma@example.com', 'hashed_password_456', 'Manager', 'https://i.pravatar.cc/150?u=brian', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:48:51', 0),
(8, 'Mohan Kumar', 'mohan.kumar@example.com', 'hashed_password_789', 'Developer', 'https://i.pravatar.cc/150?u=sean', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:48:22', 0),
(9, 'Ashif Khan', 'ashif.k@example.com', 'hashed_password_abc', 'QA', '', 1, '2025-06-04 17:42:06', 0, '2025-06-04 17:42:06', 0),
(10, 'Udit Mehta', 'udit.m@example.com', 'hashed_password_xyz', 'Developer', 'https://i.pravatar.cc/150?u=max', 1, '2025-06-04 17:42:06', 0, '2025-06-05 12:48:20', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mm_priority_target`
--
ALTER TABLE `mm_priority_target`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mm_priority_task`
--
ALTER TABLE `mm_priority_task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mm_status_project`
--
ALTER TABLE `mm_status_project`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- Indexes for table `mm_status_target`
--
ALTER TABLE `mm_status_target`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mm_status_task`
--
ALTER TABLE `mm_status_task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mm_tags_note`
--
ALTER TABLE `mm_tags_note`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `note_tags`
--
ALTER TABLE `note_tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_master`
--
ALTER TABLE `project_master`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_notes`
--
ALTER TABLE `project_notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_targets`
--
ALTER TABLE `project_targets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `project_tasks`
--
ALTER TABLE `project_tasks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `target_members`
--
ALTER TABLE `target_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `task_members`
--
ALTER TABLE `task_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_master`
--
ALTER TABLE `user_master`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mm_priority_target`
--
ALTER TABLE `mm_priority_target`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mm_priority_task`
--
ALTER TABLE `mm_priority_task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mm_status_project`
--
ALTER TABLE `mm_status_project`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mm_status_target`
--
ALTER TABLE `mm_status_target`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mm_status_task`
--
ALTER TABLE `mm_status_task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mm_tags_note`
--
ALTER TABLE `mm_tags_note`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `note_tags`
--
ALTER TABLE `note_tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `project_master`
--
ALTER TABLE `project_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `project_members`
--
ALTER TABLE `project_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- AUTO_INCREMENT for table `project_notes`
--
ALTER TABLE `project_notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `project_targets`
--
ALTER TABLE `project_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `project_tasks`
--
ALTER TABLE `project_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `target_members`
--
ALTER TABLE `target_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `task_members`
--
ALTER TABLE `task_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `user_master`
--
ALTER TABLE `user_master`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
