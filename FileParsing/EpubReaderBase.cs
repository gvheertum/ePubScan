using System;
using System.IO.Compression;
using System.Linq;
using System.Xml.Linq;
using System.IO;
using EpubAnalyzer.Entities;

namespace EpubAnalyzer.FileParsing
{
	public abstract class EpubReaderBase
	{
		protected abstract string FileMaskToSearch {get;}
		public EbookData GetData(FileInfo fileInfo)
		{
			try		
			{
				string fileContent = GetRelevantFileContentEpubFile(fileInfo.FullName, FileMaskToSearch);
				return GetDataInternal(fileContent, fileInfo);
			}
			catch(Exception e)
			{
				System.Console.WriteLine($"Cannot read data: {e.Message}");
				return null;
			}

		}
	
		protected abstract EbookData GetDataInternal(string fileContent, FileInfo fileInfo);
		
		protected XDocument ParseDesciptorFile(string fileContent)
		{
			var d = XDocument.Load(new StringReader(fileContent));
			return d;
		}

		protected string GetRelevantFileContentEpubFile(string file, string fileSuffixToSearch)
		{
			if(!System.IO.File.Exists(file)) { throw new Exception("Invalid epub file"); }
			using(var za = ZipFile.Open(file, ZipArchiveMode.Read))
			{
				var metaDataFile = za.Entries.FirstOrDefault(e => e.FullName.EndsWith(fileSuffixToSearch));
				if(metaDataFile != null)
				{
					using(var s = new System.IO.StreamReader(metaDataFile.Open()))
					{
						var res = s.ReadToEnd();
						return res;
					}
				}
			}
			return null;
		}
	}
}