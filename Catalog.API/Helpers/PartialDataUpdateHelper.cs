namespace Catalog.API.Helpers
{
	//Helper for partial updates of data, this will merge new fields over the existing object (and leave them be if they are not set)
    public abstract class PartialDataUpdateHelper<T>
	{
		public T MergeNewDataInOriginal(T input)
		{
			return MergeNewDataIntoOriginalObject(input, RetrieveOriginal(input));
		}

		//Helper to get the original object from the system based on the input
		protected abstract T RetrieveOriginal(T input);

		//Merge data from the new object into the original and return the original
		protected abstract T MergeNewDataIntoOriginalObject(T input, T original);

		//Get the overrided value or leave the original be
		protected string GetOverrideOrOriginal(string originalData, string overrideData)
		{
			return !string.IsNullOrWhiteSpace(overrideData) ? overrideData : originalData;
		}

		//Get the overrided value or leave the original be
		protected int? GetOverrideOrOriginal(int? originalData, int? overrideData)
		{
			return overrideData != null ? overrideData : originalData;
		}
	}
}
