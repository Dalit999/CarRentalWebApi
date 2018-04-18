/*************************/
/* Create Branches Table */
/*************************/
USE [CarRental]
GO

/****** Object:  Table [dbo].[Branches]    Script Date: 4/18/2018 3:04:24 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Branches](
	[BranchId] [int] IDENTITY(1,1) NOT NULL,
	[Address] [nvarchar](100) NOT NULL,
	[Latitude] [int] NOT NULL,
	[LatitudeMinutes] [int] NOT NULL,
	[IsNorth] [bit] NOT NULL,
	[Longitude] [int] NOT NULL,
	[LongitudeMinutes] [int] NOT NULL,
	[IsEast] [bit] NOT NULL,
	[BranchName] [nvarchar](20) NOT NULL,
 CONSTRAINT [PK_Branches] PRIMARY KEY CLUSTERED 
(
	[BranchId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_BranchName] UNIQUE NONCLUSTERED 
(
	[BranchName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

/*************************/
/* Create CarTypes Table */
/*************************/
USE [CarRental]
GO

/****** Object:  Table [dbo].[CarTypes]    Script Date: 4/18/2018 3:05:34 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[CarTypes](
	[CarTypeId] [int] IDENTITY(1,1) NOT NULL,
	[Manufacturer] [varchar](20) NOT NULL,
	[Model] [nvarchar](20) NOT NULL,
	[DailyCost] [decimal](5, 2) NOT NULL,
	[DailyPenaltyFee] [decimal](5, 2) NOT NULL,
	[ProductionYear] [int] NOT NULL,
	[AutomaticGear] [bit] NOT NULL,
 CONSTRAINT [PK_CarTypes] PRIMARY KEY CLUSTERED 
(
	[CarTypeId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_CarTypes] UNIQUE NONCLUSTERED 
(
	[Manufacturer] ASC,
	[Model] ASC,
	[ProductionYear] ASC,
	[AutomaticGear] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

/**************************/
/* Create UserRoles Table */
/**************************/
USE [CarRental]
GO

/****** Object:  Table [dbo].[UserRoles]    Script Date: 4/18/2018 3:08:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[UserRoles](
	[UserRoleId] [int] IDENTITY(1,1) NOT NULL,
	[UserRoleName] [nvarchar](10) NOT NULL,
 CONSTRAINT [PK_UserRoles] PRIMARY KEY CLUSTERED 
(
	[UserRoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_UserRoleName] UNIQUE NONCLUSTERED 
(
	[UserRoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

/**********************/
/* Create Users Table */
/**********************/
USE [CarRental]
GO

/****** Object:  Table [dbo].[Users]    Script Date: 4/18/2018 3:09:57 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Users](
	[FullName] [nvarchar](50) NOT NULL,
	[IdentificationNumber] [char](9) NOT NULL,
	[UserName] [varchar](10) NOT NULL,
	[BirthDate] [date] NULL,
	[IsFemale] [bit] NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](20) NOT NULL,
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[UserRoleId] [int] NOT NULL,
	[Photo] [nvarchar](200) NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_UserName] UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[Users]  WITH CHECK ADD FOREIGN KEY([UserRoleId])
REFERENCES [dbo].[UserRoles] ([UserRoleId])
GO

/*********************/
/* Create Cars Table */
/*********************/
USE [CarRental]
GO

/****** Object:  Table [dbo].[Cars]    Script Date: 4/18/2018 3:11:23 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[Cars](
	[CarId] [int] IDENTITY(1,1) NOT NULL,
	[CarTypeId] [int] NOT NULL,
	[Kilometers] [bigint] NOT NULL,
	[IsConditionOK] [bit] NOT NULL,
	[LicensePlate] [varchar](10) NOT NULL,
	[BranchId] [int] NOT NULL,
	[Photo] [nvarchar](200) NULL,
 CONSTRAINT [PK_Cars] PRIMARY KEY CLUSTERED 
(
	[CarId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [AK_LicensePlate] UNIQUE NONCLUSTERED 
(
	[LicensePlate] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO

ALTER TABLE [dbo].[Cars]  WITH CHECK ADD FOREIGN KEY([BranchId])
REFERENCES [dbo].[Branches] ([BranchId])
GO

ALTER TABLE [dbo].[Cars]  WITH CHECK ADD FOREIGN KEY([CarTypeId])
REFERENCES [dbo].[CarTypes] ([CarTypeId])
GO

/*****************************/
/* Create RentalOrders Table */
/*****************************/

USE [CarRental]
GO

/****** Object:  Table [dbo].[RentalOrders]    Script Date: 4/18/2018 3:11:41 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[RentalOrders](
	[RentalOrderId] [int] IDENTITY(1,1) NOT NULL,
	[RentStartDate] [date] NOT NULL,
	[RentEndDate] [date] NOT NULL,
	[ActualRentEndDate] [date] NULL,
	[UserId] [int] NOT NULL,
	[CarId] [int] NOT NULL,
 CONSTRAINT [PK_RentalOrders] PRIMARY KEY CLUSTERED 
(
	[RentalOrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[RentalOrders]  WITH CHECK ADD FOREIGN KEY([CarId])
REFERENCES [dbo].[Cars] ([CarId])
GO

ALTER TABLE [dbo].[RentalOrders]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([UserId])
GO







