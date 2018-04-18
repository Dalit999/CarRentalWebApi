/*****************************/
/* Create CarRental Database */
/*****************************/

USE [Master]
GO

CREATE DATABASE [CarRental] ON  PRIMARY 
( NAME = N'CarRental', FILENAME = N'\FSASQLDBCarRental.mdf' , 
  SIZE = 2GB , MAXSIZE = 8GB, FILEGROWTH = 1GB )
LOG ON 
( NAME = N'CarRental_log', FILENAME = N'\FSASQLDBCarRental_log.ldf' , 
  SIZE = 1GB , MAXSIZE = 2GB , FILEGROWTH = 10%)
GO
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


/*------------------------------------------------ Fill The tables with data: --------------------*/
/*************************/
/* Fill Branches Table */
/*************************/

USE [CarRental]
GO

INSERT INTO [dbo].[Branches]
           ([Address]
           ,[Latitude]
           ,[LatitudeMinutes]
           ,[IsNorth]
           ,[Longitude]
           ,[LongitudeMinutes]
           ,[IsEast]
           ,[BranchName])
     VALUES
           ('4 Bet Oved St, Tel Aviv'
           ,32
           ,10
           ,1
           ,34
           ,15
           ,1
           ,'John Bryce')
GO
INSERT INTO [dbo].[Branches]
           ([Address]
           ,[Latitude]
           ,[LatitudeMinutes]
           ,[IsNorth]
           ,[Longitude]
           ,[LongitudeMinutes]
           ,[IsEast]
           ,[BranchName])
     VALUES
           ('Ben Yehuda TelAviv'
           ,10
           ,11
           ,1
           ,99
           ,18
           ,1
           ,'BenYehuda')
GO
INSERT INTO [dbo].[Branches]
           ([Address]
           ,[Latitude]
           ,[LatitudeMinutes]
           ,[IsNorth]
           ,[Longitude]
           ,[LongitudeMinutes]
           ,[IsEast]
           ,[BranchName])
     VALUES
           ('Haifa port 47'
           ,49
           ,10
           ,1
           ,99
           ,18
           ,1
           ,'Haifa')
GO
INSERT INTO [dbo].[Branches]
           ([Address]
           ,[Latitude]
           ,[LatitudeMinutes]
           ,[IsNorth]
           ,[Longitude]
           ,[LongitudeMinutes]
           ,[IsEast]
           ,[BranchName])
     VALUES
           ('Dimona textiles'
           ,0
           ,0
           ,1
           ,0
           ,0
           ,1
           ,'Dimona')
GO

/*************************/
/* Fill CarTypes Table */
/*************************/
USE [CarRental]
GO

INSERT INTO [dbo].[CarTypes]
           ([Manufacturer]
           ,[Model]
           ,[DailyCost]
           ,[DailyPenaltyFee]
           ,[ProductionYear]
           ,[AutomaticGear])
     VALUES
           ('Skoda'
           ,'Yeti'
           ,100.00
           ,150.00
           ,2015
           ,1)
GO


INSERT INTO [dbo].[CarTypes]
           ([Manufacturer]
           ,[Model]
           ,[DailyCost]
           ,[DailyPenaltyFee]
           ,[ProductionYear]
           ,[AutomaticGear])
     VALUES
           ('Hyundai'
           ,'Getz'
           ,70.00
           ,110.00
           ,2017
           ,1)
GO


INSERT INTO [dbo].[CarTypes]
           ([Manufacturer]
           ,[Model]
           ,[DailyCost]
           ,[DailyPenaltyFee]
           ,[ProductionYear]
           ,[AutomaticGear])
     VALUES
           ('Gallifrey'
           ,'Timey Wimey'
           ,50.00
           ,400.00
           ,2047
           ,1)
GO


INSERT INTO [dbo].[CarTypes]
           ([Manufacturer]
           ,[Model]
           ,[DailyCost]
           ,[DailyPenaltyFee]
           ,[ProductionYear]
           ,[AutomaticGear])
     VALUES
           ('unknown'
           ,'Old'
           ,133.00
           ,147.00
           ,1950
           ,0)
GO


INSERT INTO [dbo].[CarTypes]
           ([Manufacturer]
           ,[Model]
           ,[DailyCost]
           ,[DailyPenaltyFee]
           ,[ProductionYear]
           ,[AutomaticGear])
     VALUES
           ('Volkswagen'
           ,'Sportwagon'
           ,400.00
           ,150.00
           ,2015
           ,0)
GO



/**************************/
/* Fill UserRoles Table */
/**************************/
USE [CarRental]
GO

INSERT INTO [dbo].[UserRoles]
           ([UserRoleName])
     VALUES
           ('admin')
GO


INSERT INTO [dbo].[UserRoles]
           ([UserRoleName])
     VALUES
           ('client')
GO


INSERT INTO [dbo].[UserRoles]
           ([UserRoleName])
     VALUES
           ('employee')
GO

/**********************/
/* Fill Users Table */
/**********************/
USE [CarRental]
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Dalit Shemesh'
,'058811720'
,'Dalit2'
,''
,1
,'shemesh.dalit@gmail.com'
,'dalit999'
,1
,'')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Allways right'
,'123412348'
,'WonderW'
,'4/7/2018 12:00:00 AM'
,0
,'a@aaa.com'
,'WonderW'
,2
,'https://pixel.nymag.com/imgs/daily/vulture/2017/06/20/20-gal-gadot.w710.h473.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('very Good Worker'
,'654152   '
,'GoodWorker'
,'7/25/1964 12:00:00 AM'
,0
,'b@b111.co.uk'
,'bibi1'
,3
,'https://previews.123rf.com/images/kakigori/kakigori1506/kakigori150600018/40977362-illustration-of-cute-happy-family-of-four-members-traveling-on-blue-car.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Pika Zvik'
,'646513218'
,'pika'
,'1/2/1221 12:00:00 AM'
,0
,'pika@zvik.co.il'
,'maala'
,2
,'https://img.mako.co.il/2011/12/27/tzvika_pick1_b.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Mr. Bean'
,'385138136'
,'bean'
,'1/17/2018 12:00:00 AM'
,0
,'bean@bean.bean'
,'bean1'
,3
,'https://vignette.wikia.nocookie.net/deathbattlefanon/images/6/6a/Mr_bean.png/revision/latest?cb=20161209125040')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Bonny Nan'
,'475313755'
,'bubu'
,'4/25/2018 12:00:00 AM'
,0
,'bubu@agaba.com'
,'sdfgsdg'
,1
,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD0-mdzFjDaV3bSg74UXpPKgTKmmn47M4p34V5HBWAVPmQ65G_')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Baby boss'
,'574641239'
,'The boss'
,'4/18/2018 12:00:00 AM'
,1
,'bakbuk@gmail.com'
,'agagagaga'
,2
,'https://image.freepik.com/free-photo/asian-baby-girl_20263-138.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Haim Najman'
,'3214657  '
,'najman man'
,'4/11/1989 12:00:00 AM'
,0
,'najman_man@walla.com'
,'ggrrs'
,2
,'https://image.freepik.com/free-photo/technology-shirt-mode-black-person-male_1303-2930.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Menta Wong'
,'1654961  '
,'Menta Wong'
,'11/21/1994 12:00:00 AM'
,1
,'Menta_Wong@omg.com'
,'fdfdtyj'
,3
,'https://image.freepik.com/free-photo/travel-concept-close-up-portrait-young-beautiful-attractive-redhair-girl-wtih-trendy-hat-and-sunglass-smiling-blue-pastel-background-copy-space_1258-852.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Israela Cohen'
,'234759025'
,'Israela'
,'11/10/1992 12:00:00 AM'
,1
,'sarsar@walla.co.il'
,'fgthfdfd'
,1
,'https://image.freepik.com/free-photo/friendly-brunette-looking-at-camera_23-2147774849.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('George Jun'
,'520943879'
,'JGeorge'
,'7/2/1966 12:00:00 AM'
,1
,'JGeorge@omg.com'
,'gvdfhu5'
,2
,'https://image.freepik.com/free-photo/smiling-businessman-with-digital-tablet_1098-651.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Purrfect family'
,'769403874'
,'Purrfect'
,'4/6/1987 12:00:00 AM'
,0
,'family@blabal.com'
,'hh6655g'
,2
,'https://image.freepik.com/free-photo/portrait-of-a-happy-family-lying-on-each-other_13339-201951.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Hanna Senesh'
,'682135686'
,'HanaBanana'
,'7/12/2000 12:00:00 AM'
,1
,'Hunna@walla.co.il'
,'ghjgdfh'
,2
,'https://image.freepik.com/free-photo/cheerful-woman-posing-in-field_23-2147699200.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Jeb Jeb'
,'342364544'
,'Jeb Jebon'
,'8/11/1998 12:00:00 AM'
,1
,'Jeb.Jeb@jeb.jrb'
,'54467771'
,2
,'https://image.freepik.com/free-photo/businessman-with-arms-crossed-and-smiling_1139-677.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('Future dent'
,'1335462  '
,'Dentist'
,'8/19/2037 12:00:00 AM'
,1
,'dentist@walla.co.il'
,'k6665hjhfdd'
,2
,'https://image.freepik.com/free-photo/proud-young-executive-ready-to-start_1139-303.jpg')
GO

INSERT INTO [dbo].[Users]
([FullName]
,[IdentificationNumber]
,[UserName]
,[BirthDate]
,[IsFemale]
,[Email]
,[Password]
,[UserRoleId]
,[Photo])
VALUES
('The Doctor'
,'777777772'
,'11doc'
,'11/11/1001 12:00:00 AM'
,1
,'notATimeTraveler@timey.wimey'
,'fffeee555'
,2
,'https://i.pinimg.com/originals/04/23/ef/0423ef3092ec920a9806eed0bcb3b27d.jpg')
GO


/*********************/
/* Fill Cars Table */
/*********************/
USE [CarRental]
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(2
,0
,1
,'8846576'
,1
,'https://d3lp4xedbqa8a5.cloudfront.net/imagegen/max/ccr/860/-/s3/digital-cougar-assets/traderspecs/2015/08/07/Misc/Skoda-Yeti-Active-1-(1).jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(3
,4
,1
,'1111111'
,1012
,'https://d32ptomnhiuevv.cloudfront.net/en-gb/sites/default/files/styles/model_landing_thumbnail/public/models/hyundai-getz-gsi-1.4-2006.jpg?itok=6q6Z1AIT')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(2
,4
,1
,'2222222'
,1
,'http://cdn1.carbuyer.co.uk/sites/carbuyer_d7/files/styles/article_main_image/public/car_images/skoda-yeti.jpg?itok=OSAJn0-n')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(3
,0
,1
,'999999'
,1013
,'https://res.cloudinary.com/carsguide/image/upload/f_auto,fl_lossy,q_auto,t_cg_hero_large/v1/editorial/dp/images/uploads/Hyundai-Getz-2002-3W.jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(3
,15
,1
,'798789'
,1012
,'https://res.cloudinary.com/carsguide/image/upload/f_auto,fl_lossy,q_auto,t_cg_hero_low/v1/cg_vehicle/ds/2009_hyundai_getz.jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(3
,1000
,1
,'123456'
,1
,'https://d32ptomnhiuevv.cloudfront.net/en-gb/sites/default/files/styles/model_landing_thumbnail/public/models/hyundai-getz-gsi-1.4-2006.jpg?itok=6q6Z1AIT')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(2
,0
,0
,'13456'
,1
,'https://www.motoractual.es/wp-content/uploads/2017/04/Skoda-Karoq-2018-1.jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(2
,0
,0
,'asdff'
,1
,'https://preview.netcarshow.com/Skoda-Yeti_2_Concept-2005-hd.jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(1013
,9000
,0
,'blue box'
,1013
,'https://dyn0.media.forbiddenplanet.com/products/tardis-3.jpg.jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(1015
,500
,1
,'8846132'
,1012
,'https://res.cloudinary.com/autofile-communications-inc/image/upload/c_fit,h_365,w_584/v1/article/article17139/dc9afscjkmyiryaf7lus.jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(1015
,40000
,1
,'7778141'
,1
,'https://www.askautoexperts.com/wp-content/uploads/1_-1967-VW-Westfalia-camper-1024x768.jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(1014
,874927
,1
,'9801146'
,1013
,'http://www.car-blogger.co.uk/wp-content/uploads/2015/08/best-family-car.jpg')
GO

INSERT INTO [dbo].[Cars]
([CarTypeId]
,[Kilometers]
,[IsConditionOK]
,[LicensePlate]
,[BranchId]
,[Photo])
VALUES
(3
,460
,1
,'19975041'
,1013
,'http://i.i-sgcm.com/cars_used/201411/438078_2.jpg')
GO

/*****************************/
/* Fill RentalOrders Table */
/*****************************/

USE [CarRental]
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('4/30/2018 12:00:00 AM'
,'4/24/2019 12:00:00 AM'
,2
,1013)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[ActualRentEndDate]
,[UserId]
,[CarId])
VALUES
('12/24/2017 12:00:00 AM'
,'1/15/2018 12:00:00 AM'
,'1/15/2018 12:00:00 AM'
,1025
,1015)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[ActualRentEndDate]
,[UserId]
,[CarId])
VALUES
('4/1/2018 12:00:00 AM'
,'4/3/2018 12:00:00 AM'
,'4/5/2018 12:00:00 AM'
,1031
,9)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[ActualRentEndDate]
,[UserId]
,[CarId])
VALUES
('2/3/2018 12:00:00 AM'
,'2/19/2018 12:00:00 AM'
,'2/17/2018 12:00:00 AM'
,3
,3)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[ActualRentEndDate]
,[UserId]
,[CarId])
VALUES
('1/9/2018 12:00:00 AM'
,'2/20/2018 12:00:00 AM'
,'2/20/2018 12:00:00 AM'
,1027
,2)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('5/15/2018 12:00:00 AM'
,'6/15/2018 12:00:00 AM'
,1026
,1017)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('6/18/2018 12:00:00 AM'
,'6/25/2018 12:00:00 AM'
,1030
,1017)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('4/1/2018 12:00:00 AM'
,'4/21/2018 12:00:00 AM'
,5
,1015)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('4/19/2018 12:00:00 AM'
,'4/23/2018 12:00:00 AM'
,6
,9)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('4/18/2018 12:00:00 AM'
,'7/31/2018 12:00:00 AM'
,1028
,13)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('5/1/2018 12:00:00 AM'
,'5/31/2018 12:00:00 AM'
,7
,1018)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('4/25/2018 12:00:00 AM'
,'6/20/2018 12:00:00 AM'
,1031
,1014)
GO

INSERT INTO [dbo].[RentalOrders]
([RentStartDate]
,[RentEndDate]
,[UserId]
,[CarId])
VALUES
('4/28/2018 12:00:00 AM'
,'5/23/2018 12:00:00 AM'
,1033
,9)
GO



