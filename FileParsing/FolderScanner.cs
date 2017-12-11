using System;
using System.IO.Compression;
using System.Linq;
using System.Collections.Generic;
using System.Xml.Linq;
using System.IO;

namespace EpubAnalyzer.FileParsing
{
	public class FolderScanner
	{
		public List<string> GetEpubFilesFromFolder(string folder)
		{
			var di = new System.IO.DirectoryInfo(folder);
			return di.GetFileSystemInfos().Where(fi => fi.Extension == ".epub").Select(fi => fi.FullName).ToList();
		}
	}
}