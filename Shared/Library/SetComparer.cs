using System;
using System.Collections.Generic;
using System.Linq;
using ePubAnalyzer.Shared.Entities;

namespace ePubAnalyzer.Shared.Library
{
	public class SetComparer<T> where T : class
	{
		protected Func<T, T, bool> _existingItemCheck;
		protected Func<T, T, T> _mergeOriginalIntoNew;

		protected SetComparer() {}
		public SetComparer(Func<T,T, bool> existingItemCheck, Func<T,T,T> mergeOriginalIntoNew)
		{
			_existingItemCheck = existingItemCheck;
			_mergeOriginalIntoNew = mergeOriginalIntoNew;
		}

		public ComparisonContainer<T> GetComparisonContainer(IEnumerable<T> original, IEnumerable<T> newSet)
		{
			var res = GetComparisonObjects(original, newSet);
			return new ComparisonContainer<T>(res);
		}

		public IEnumerable<ComparisonObject<T>> GetComparisonObjects(IEnumerable<T> original, IEnumerable<T> newSet)
		{
			//See if we have items no longer in original
			foreach(var originalItem in original)
			{
				if(!newSet.Any(n => _existingItemCheck(originalItem, n)))
				{
					yield return new ComparisonObject<T>() { Element = originalItem, Result = ComparisonResult.Removed };
				}
			}

			foreach(var newItem in newSet)
			{
				if(!original.Any(o => _existingItemCheck(newItem, o)))
				{
					yield return new ComparisonObject<T>() { Element = newItem, Result = ComparisonResult.New };					
				}
				else
				{
					var matched = original.SingleOrDefault(o => _existingItemCheck(newItem, o));
					yield return new ComparisonObject<T>() { Element = _mergeOriginalIntoNew(matched, newItem), Result = ComparisonResult.Existing };
				}
			}
		}
	}
}